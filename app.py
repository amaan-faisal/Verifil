from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import os 

app = Flask(__name__)
CORS(app)

ETHERSCAN_API = "https://api.etherscan.io/v2/api"
COINGECKO_API = "https://api.coingecko.com/api/v3"

ETHERSCAN_API_KEY = os.environ.get('ETHERSCAN_API_KEY', '')

def get_eth_balance(address):
    """Get ETH balance for a wallet address"""
    try:
        params = {
            'chainid': '1',
            'module': 'account',
            'action': 'balance',
            'address': address,
            'tag': 'latest',
            'apikey': ETHERSCAN_API_KEY
        }
        response = requests.get(ETHERSCAN_API, params=params)
        data = response.json()
        
        if data['status'] == '1':
            balance_wei = int(data['result'])
            balance_eth = balance_wei / 10**18
            return balance_eth
        return 0
    except Exception as e:
        print(f"Error fetching ETH balance: {e}")
        return 0

def get_token_balances(address):
    """Get ERC-20 token balances for a wallet address"""
    try:
        params = {
            'chainid': '1',
            'module': 'account',
            'action': 'tokentx',
            'address': address,
            'startblock': 0,
            'endblock': 99999999,
            'sort': 'desc',
            'apikey': ETHERSCAN_API_KEY
        }
        response = requests.get(ETHERSCAN_API, params=params)
        data = response.json()
        
        if data['status'] == '1' and isinstance(data.get('result'), list):
            token_balances = {}
            
            for tx in data['result']:
                token_name = tx.get('tokenName', 'Unknown')
                token_symbol = tx.get('tokenSymbol', 'Unknown')
                decimals = int(tx.get('tokenDecimal', 18))
                contract = tx['contractAddress']
                
                if contract not in token_balances:
                    token_balances[contract] = {
                        'name': token_name,
                        'symbol': token_symbol,
                        'balance': 0,
                        'decimals': decimals
                    }
                
                value = int(tx['value'])
                if tx['to'].lower() == address.lower():
                    token_balances[contract]['balance'] += value
                if tx['from'].lower() == address.lower():
                    token_balances[contract]['balance'] -= value
            
            holdings = []
            for contract, info in token_balances.items():
                balance = info['balance'] / (10 ** info['decimals'])
                if balance > 0:
                    holdings.append({
                        'name': info['name'],
                        'symbol': info['symbol'],
                        'balance': round(balance, 6),
                        'contract': contract.lower()
                    })
            
            return holdings
        return []
    except Exception as e:
        print(f"Error fetching token balances: {e}")
        return []

def get_token_price_by_contract(contract_address):
    """Get USD price for a token by its contract address using CoinGecko"""
    try:
        url = f"{COINGECKO_API}/simple/token_price/ethereum"
        params = {
            'contract_addresses': contract_address,
            'vs_currencies': 'usd'
        }
        response = requests.get(url, params=params)
        data = response.json()
        
        if contract_address.lower() in data:
            return data[contract_address.lower()].get('usd', 0)
        return 0
    except Exception as e:
        print(f"Error fetching price for {contract_address}: {e}")
        return 0

# Cache for ETH price to reduce API calls
eth_price_cache = {'price': 0, 'timestamp': 0}
ETH_PRICE_CACHE_DURATION = 60  # Cache for 60 seconds

def get_eth_price():
    """Get current ETH price in USD with caching and fallback"""
    import time
    
    # Check cache first
    current_time = time.time()
    if (current_time - eth_price_cache['timestamp']) < ETH_PRICE_CACHE_DURATION and eth_price_cache['price'] > 0:
        return eth_price_cache['price']
    
    # Try CoinGecko first
    try:
        response = requests.get(f"{COINGECKO_API}/simple/price", params={
            'ids': 'ethereum',
            'vs_currencies': 'usd'
        })
        data = response.json()
        
        if 'ethereum' in data and 'usd' in data['ethereum']:
            price = data['ethereum']['usd']
            eth_price_cache['price'] = price
            eth_price_cache['timestamp'] = current_time
            print(f"✓ ETH price: ${price} (CoinGecko)")
            return price
    except Exception as e:
        print(f"CoinGecko ETH price failed: {e}")
    
    # Fallback: Use a reasonable ETH price estimate
    fallback_price = 3500  # Reasonable ETH price estimate
    print(f"⚠️ Using fallback ETH price: ${fallback_price}")
    eth_price_cache['price'] = fallback_price
    eth_price_cache['timestamp'] = current_time
    return fallback_price

def get_price_from_1inch(contract_address):
    """Try to get price from 1inch API as fallback"""
    try:
        # 1inch API doesn't require auth for basic price queries
        url = f"https://api.1inch.dev/price/v1.1/1/{contract_address}"
        response = requests.get(url, timeout=3)
        
        if response.status_code == 200:
            data = response.json()
            # 1inch returns price in USD directly
            return data.get(contract_address.lower(), 0)
        return 0
    except:
        return 0

def get_all_token_prices(contract_addresses):
    """Get USD prices for tokens with multiple fallback sources"""
    if not contract_addresses:
        return {}
    
    all_prices = {}
    
    # Common stablecoins we can hardcode
    STABLECOINS = {
        '0xdac17f958d2ee523a2206206994597c13d831ec7': 1.00,  # USDT
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 1.00,  # USDC
        '0x6b175474e89094c44da98b954eedeac495271d0f': 1.00,  # DAI
        '0x4fabb145d64652a948d72533023f6e7a623c7c53': 1.00,  # BUSD
        '0x0000000000085d4780b73119b644ae5ecd22b376': 1.00,  # TUSD
    }
    
    # Well-known tokens we can try with CoinGecko
    MAJOR_TOKENS = {
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin',  # WBTC
        '0x514910771af9ca656af840dff83e8264ecf986ca': 'chainlink',  # LINK
        '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'matic-network',  # MATIC
        '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap',  # UNI
        '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'aave',  # AAVE
        '0xc00e94cb662c3520282e6f5717214004a7f26888': 'compound-governance-token',  # COMP
        '0x0d8775f648430679a709e98d2b0cb6250d2887ef': 'basic-attention-token',  # BAT
        '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': 'maker',  # MKR
    }
    
    # Limit to first 15 tokens to stay within rate limits
    limited_addresses = contract_addresses[:15]
    
    print(f"Fetching prices for {len(limited_addresses)} tokens...")
    
    for contract in limited_addresses:
        contract_lower = contract.lower()
        
        # Check if it's a known stablecoin
        if contract_lower in STABLECOINS:
            all_prices[contract_lower] = STABLECOINS[contract_lower]
            print(f"✓ {contract[:8]}... = $1.00 (stablecoin)")
            continue
        
        # Try CoinGecko
        try:
            url = f"{COINGECKO_API}/simple/token_price/ethereum"
            params = {
                'contract_addresses': contract,
                'vs_currencies': 'usd'
            }
            
            response = requests.get(url, params=params, timeout=5)
            data = response.json()
            
            # DEBUG: Print full response
            print(f"DEBUG - CoinGecko response for {contract[:8]}...: {data}")
            
            if isinstance(data, dict) and contract_lower in data:
                price_data = data[contract_lower]
                if isinstance(price_data, dict) and 'usd' in price_data:
                    price = price_data['usd']
                    all_prices[contract_lower] = price
                    print(f"✓ {contract[:8]}... = ${price} (CoinGecko)")
                    time.sleep(0.5)
                    continue
            else:
                print(f"DEBUG - Keys in response: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
        except Exception as e:
            print(f"CoinGecko failed for {contract[:8]}...: {e}")
            import traceback
            traceback.print_exc()
        
        # If CoinGecko fails, try 1inch
        price_1inch = get_price_from_1inch(contract)
        if price_1inch > 0:
            all_prices[contract_lower] = price_1inch
            print(f"✓ {contract[:8]}... = ${price_1inch} (1inch)")
        else:
            all_prices[contract_lower] = 0
            print(f"✗ {contract[:8]}... - No price found")
        
        time.sleep(0.5)
    
    # Remaining tokens get 0
    if len(contract_addresses) > 15:
        print(f"⚠️  Only fetched prices for first 15 tokens (rate limit)")
        for contract in contract_addresses[15:]:
            all_prices[contract.lower()] = 0
    
    return all_prices

@app.route('/api/wallet/<address>', methods=['GET'])
def get_wallet_info(address):
    """Main endpoint to get wallet balance and holdings with USD values"""
    
    if not address.startswith('0x') or len(address) != 42:
        return jsonify({'error': 'Invalid Ethereum address'}), 400
    
    # Get ETH balance
    eth_balance = get_eth_balance(address)
    
    # Get ETH price
    eth_price = get_eth_price()
    eth_value_usd = eth_balance * eth_price
    
    # Get token holdings
    token_holdings = get_token_balances(address)
    
    # Get prices for all tokens at once
    if token_holdings:
        contract_addresses = [holding['contract'] for holding in token_holdings]
        token_prices = get_all_token_prices(contract_addresses)
        
        # Add USD values to each holding
        for holding in token_holdings:
            price = token_prices.get(holding['contract'].lower(), 0)
            holding['price_usd'] = round(price, 2) if price else 0
            holding['value_usd'] = round(holding['balance'] * price, 2) if price else 0
    
    # Calculate total portfolio value
    total_token_value = sum(h['value_usd'] for h in token_holdings)
    total_value_usd = eth_value_usd + total_token_value
    
    # Sort holdings by USD value (highest first)
    token_holdings.sort(key=lambda x: x['value_usd'], reverse=True)
    
    response = {
        'address': address,
        'eth_balance': round(eth_balance, 6),
        'eth_price_usd': round(eth_price, 2),
        'eth_value_usd': round(eth_value_usd, 2),
        'token_holdings': token_holdings,
        'total_token_value_usd': round(total_token_value, 2),
        'total_portfolio_value_usd': round(total_value_usd, 2),
        'holdings_count': len(token_holdings)
    }
    
    return jsonify(response)

@app.route('/api/token-price/<contract>', methods=['GET'])
def get_token_price_endpoint(contract):
    """Endpoint to get price for a specific token contract"""
    price = get_token_price_by_contract(contract)
    return jsonify({
        'contract': contract,
        'price_usd': price
    })

def get_normal_transactions(address, limit=50):
    """Get normal ETH transactions"""
    try:
        params = {
            'chainid': '1',
            'module': 'account',
            'action': 'txlist',
            'address': address,
            'startblock': 0,
            'endblock': 99999999,
            'page': 1,
            'offset': limit,
            'sort': 'desc',
            'apikey': ETHERSCAN_API_KEY
        }
        response = requests.get(ETHERSCAN_API, params=params)
        data = response.json()
        
        if data['status'] == '1' and isinstance(data.get('result'), list):
            transactions = []
            for tx in data['result']:
                tx_type = 'receive' if tx['to'].lower() == address.lower() else 'send'
                value_eth = int(tx['value']) / 10**18
                
                # Convert timestamp properly - Etherscan returns Unix timestamp
                timestamp = int(tx['timeStamp'])
                
                transactions.append({
                    'hash': tx['hash'],
                    'type': tx_type,
                    'from': tx['from'],
                    'to': tx['to'],
                    'value_eth': round(value_eth, 6),
                    'timestamp': timestamp,
                    'block_number': int(tx['blockNumber']),
                    'gas_used': int(tx['gasUsed']),
                    'gas_price': int(tx['gasPrice']) / 10**9,  # Convert to Gwei
                    'is_error': tx['isError'] == '1',
                    'asset': 'ETH',
                    'token_symbol': 'ETH'
                })
            return transactions
        return []
    except Exception as e:
        print(f"Error fetching normal transactions: {e}")
        return []

def get_erc20_transactions(address, limit=50):
    """Get ERC-20 token transactions"""
    try:
        params = {
            'chainid': '1',
            'module': 'account',
            'action': 'tokentx',
            'address': address,
            'startblock': 0,
            'endblock': 99999999,
            'page': 1,
            'offset': limit,
            'sort': 'desc',
            'apikey': ETHERSCAN_API_KEY
        }
        response = requests.get(ETHERSCAN_API, params=params)
        data = response.json()
        
        if data['status'] == '1' and isinstance(data.get('result'), list):
            transactions = []
            for tx in data['result']:
                tx_type = 'receive' if tx['to'].lower() == address.lower() else 'send'
                decimals = int(tx.get('tokenDecimal', 18))
                value = int(tx['value']) / (10 ** decimals)
                
                transactions.append({
                    'hash': tx['hash'],
                    'type': tx_type,
                    'from': tx['from'],
                    'to': tx['to'],
                    'value': round(value, 6),
                    'timestamp': int(tx['timeStamp']),
                    'block_number': int(tx['blockNumber']),
                    'token_name': tx.get('tokenName', 'Unknown'),
                    'token_symbol': tx.get('tokenSymbol', '???'),
                    'contract_address': tx['contractAddress'],
                    'asset': tx.get('tokenSymbol', 'TOKEN')
                })
            return transactions
        return []
    except Exception as e:
        print(f"Error fetching ERC-20 transactions: {e}")
        return []

@app.route('/api/wallet/<address>/transactions', methods=['GET'])
def get_transactions(address):
    """Get recent transactions (both ETH and ERC-20)"""
    
    if not address.startswith('0x') or len(address) != 42:
        return jsonify({'error': 'Invalid Ethereum address'}), 400
    
    # Get limit from query params (default 50)
    limit = request.args.get('limit', 50, type=int)
    limit = min(limit, 100)  # Cap at 100
    
    # Get transaction type filter
    tx_filter = request.args.get('type', 'all')  # 'all', 'eth', 'tokens'
    
    print(f"Fetching transactions for {address[:8]}... (limit: {limit})")
    
    transactions = []
    
    # Get ETH transactions
    if tx_filter in ['all', 'eth']:
        eth_txs = get_normal_transactions(address, limit)
        transactions.extend(eth_txs)
    
    # Get ERC-20 transactions
    if tx_filter in ['all', 'tokens']:
        token_txs = get_erc20_transactions(address, limit)
        transactions.extend(token_txs)
    
    # Sort by timestamp (most recent first)
    transactions.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # Limit total results
    transactions = transactions[:limit]
    
    # Calculate summary stats
    total_sent = sum(1 for tx in transactions if tx['type'] == 'send')
    total_received = sum(1 for tx in transactions if tx['type'] == 'receive')
    
    response = {
        'address': address,
        'transactions': transactions,
        'total_count': len(transactions),
        'sent_count': total_sent,
        'received_count': total_received,
        'limit': limit
    }
    
    return jsonify(response)

def get_token_info(contract_address):
    """Get detailed token information including age and holder count"""
    try:
        # Get token creation info
        params = {
            'chainid': '1',
            'module': 'account',
            'action': 'txlist',
            'address': contract_address,
            'startblock': 0,
            'endblock': 99999999,
            'page': 1,
            'offset': 1,
            'sort': 'asc',
            'apikey': ETHERSCAN_API_KEY
        }
        response = requests.get(ETHERSCAN_API, params=params)
        data = response.json()
        
        token_age_days = None
        creation_timestamp = None
        
        if data['status'] == '1' and isinstance(data.get('result'), list) and len(data['result']) > 0:
            first_tx = data['result'][0]
            creation_timestamp = int(first_tx['timeStamp'])
            import time as time_module
            current_time = int(time_module.time())
            token_age_days = (current_time - creation_timestamp) / 86400
        
        return {
            'contract_address': contract_address,
            'token_age_days': round(token_age_days, 1) if token_age_days else None,
            'creation_timestamp': creation_timestamp
        }
    except Exception as e:
        print(f"Error fetching token info for {contract_address}: {e}")
        return {
            'contract_address': contract_address,
            'token_age_days': None,
            'creation_timestamp': None
        }

def check_honeypot(contract_address):
    """Check if token is a honeypot using Honeypot.is API"""
    try:
        url = f"https://api.honeypot.is/v2/IsHoneypot"
        params = {
            'address': contract_address,
            'chainID': '1'
        }
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            # Honeypot.is returns detailed info
            return {
                'is_honeypot': data.get('honeypotResult', {}).get('isHoneypot', False),
                'buy_tax': data.get('simulationResult', {}).get('buyTax', 0),
                'sell_tax': data.get('simulationResult', {}).get('sellTax', 0),
                'has_trading_enabled': not data.get('honeypotResult', {}).get('honeypotReason', '') == 'No liquidity',
            }
        return None
    except Exception as e:
        print(f"Error checking honeypot for {contract_address}: {e}")
        return None

def get_token_holders_count(contract_address):
    """Get number of token holders (approximate from recent transactions)"""
    try:
        params = {
            'chainid': '1',
            'module': 'account',
            'action': 'tokentx',
            'contractaddress': contract_address,
            'page': 1,
            'offset': 100,
            'sort': 'desc',
            'apikey': ETHERSCAN_API_KEY
        }
        response = requests.get(ETHERSCAN_API, params=params)
        data = response.json()
        
        if data['status'] == '1' and isinstance(data.get('result'), list):
            # Count unique addresses in recent transactions
            unique_addresses = set()
            for tx in data['result']:
                unique_addresses.add(tx['from'])
                unique_addresses.add(tx['to'])
            
            return len(unique_addresses)
        return 0
    except Exception as e:
        print(f"Error fetching holder count for {contract_address}: {e}")
        return 0

@app.route('/api/wallet/<address>/risk-analysis', methods=['GET'])
def analyze_risk(address):
    """Comprehensive risk analysis for a wallet"""
    
    try:
        if not address.startswith('0x') or len(address) != 42:
            return jsonify({'error': 'Invalid Ethereum address'}), 400
        
        print(f"\n🔍 Starting risk analysis for {address[:8]}...")
        
        # Get wallet holdings
        token_holdings = get_token_balances(address)
        
        if not token_holdings:
            return jsonify({
                'address': address,
                'risk_score': 0,
                'risk_level': 'SAFE',
                'message': 'No token holdings found',
                'risky_tokens': []
            })
        
        risky_tokens = []
        total_risk_points = 0
        max_possible_points = 0
        
        # Analyze each token (limit to first 10 to avoid rate limits)
        tokens_to_analyze = token_holdings[:10]
        
        for holding in tokens_to_analyze:
            contract = holding['contract']
            print(f"\n📊 Analyzing {holding['symbol']} ({contract[:8]}...)")
            
            token_risk = {
                'name': holding['name'],
                'symbol': holding['symbol'],
                'contract': contract,
                'balance': holding['balance'],
                'risk_flags': [],
                'risk_score': 0
            }
            
            # Check 1: Token age (newer = riskier)
            token_info = get_token_info(contract)
            if token_info['token_age_days'] is not None:
                age_days = token_info['token_age_days']
                if age_days < 7:
                    token_risk['risk_flags'].append(f'Very new token (only {int(age_days)} days old)')
                    token_risk['risk_score'] += 30
                elif age_days < 30:
                    token_risk['risk_flags'].append(f'New token ({int(age_days)} days old)')
                    token_risk['risk_score'] += 15
                print(f"  Age: {int(age_days)} days")
            
            time.sleep(0.3)
            
            # Check 2: Honeypot detection
            honeypot_data = check_honeypot(contract)
            if honeypot_data:
                if honeypot_data['is_honeypot']:
                    token_risk['risk_flags'].append('HONEYPOT DETECTED - Cannot sell!')
                    token_risk['risk_score'] += 50
                
                if honeypot_data['sell_tax'] > 10:
                    token_risk['risk_flags'].append(f'High sell tax: {honeypot_data["sell_tax"]}%')
                    token_risk['risk_score'] += 20
                
                if not honeypot_data['has_trading_enabled']:
                    token_risk['risk_flags'].append('No liquidity available')
                    token_risk['risk_score'] += 25
                
                print(f"  Honeypot: {honeypot_data['is_honeypot']}, Sell tax: {honeypot_data['sell_tax']}%")
            
            time.sleep(0.3)
            
            # Check 3: Number of holders (fewer = riskier)
            holder_count = get_token_holders_count(contract)
            if holder_count < 10:
                token_risk['risk_flags'].append(f'Very few holders (only {holder_count} in recent activity)')
                token_risk['risk_score'] += 25
            elif holder_count < 50:
                token_risk['risk_flags'].append(f'Low holder count ({holder_count} in recent activity)')
                token_risk['risk_score'] += 10
            
            print(f"  Active holders: {holder_count}")
            
            time.sleep(0.3)
            
            # Check 4: Unknown/no price = potentially worthless
            if holding.get('price_usd', 0) == 0 and holding['symbol'] not in ['USDT', 'USDC', 'DAI']:
                token_risk['risk_flags'].append('No market price data available')
                token_risk['risk_score'] += 15
            
            # Add to risky tokens if any flags
            if token_risk['risk_flags']:
                risky_tokens.append(token_risk)
                total_risk_points += token_risk['risk_score']
            
            max_possible_points += 100
        
        # Calculate overall wallet risk score (0-100)
        if max_possible_points > 0:
            risk_score = min(100, int((total_risk_points / max_possible_points) * 100))
        else:
            risk_score = 0
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = 'CRITICAL'
        elif risk_score >= 50:
            risk_level = 'HIGH'
        elif risk_score >= 30:
            risk_level = 'MEDIUM'
        elif risk_score >= 10:
            risk_level = 'LOW'
        else:
            risk_level = 'SAFE'
        
        # Sort risky tokens by risk score
        risky_tokens.sort(key=lambda x: x['risk_score'], reverse=True)
        
        response = {
            'address': address,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'tokens_analyzed': len(tokens_to_analyze),
            'risky_tokens_count': len(risky_tokens),
            'risky_tokens': risky_tokens,
            'recommendations': generate_recommendations(risk_level, risky_tokens)
        }
        
        print(f"\n✅ Analysis complete. Risk score: {risk_score} ({risk_level})")
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error in risk analysis: {e}")
        return jsonify({
            'address': address,
            'error': 'Risk analysis failed',
            'message': str(e)
        }), 500

def generate_recommendations(risk_level, risky_tokens):
    """Generate actionable recommendations based on risk analysis"""
    recommendations = []
    
    if risk_level in ['CRITICAL', 'HIGH']:
        recommendations.append('⚠️ URGENT: Review and consider removing high-risk tokens from your wallet')
    
    honeypot_count = sum(1 for t in risky_tokens if any('HONEYPOT' in flag for flag in t['risk_flags']))
    if honeypot_count > 0:
        recommendations.append(f'🚨 {honeypot_count} honeypot(s) detected - these tokens cannot be sold!')
    
    new_token_count = sum(1 for t in risky_tokens if any('new token' in flag.lower() for flag in t['risk_flags']))
    if new_token_count > 0:
        recommendations.append(f'⏰ {new_token_count} very new token(s) - exercise extreme caution')
    
    no_price_count = sum(1 for t in risky_tokens if any('No market price' in flag for flag in t['risk_flags']))
    if no_price_count > 0:
        recommendations.append(f'💸 {no_price_count} token(s) have no market price - likely worthless')
    
    # if risk_level == 'SAFE':
    #     recommendations.append('✅ Your wallet looks healthy!')
    
    # return recommendations

@app.route('/api/stats', methods=['GET'])
def stats():
    # Dummy for now, real logic should read/write from persistent store when ready
    demo_wallets = [
        '0x742d35cc6634c0532925a3b844bc454e4438f44e',
        '0x8bA1f109551bD432803012645Ac136ddd64DBA72',
        '0x49e833337ecefa0cab47fa4160bed2b8092b5d10',
        '0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c',
        '0x21a31ee1afc51d94c2efccaa2092ad1028285549',
    ]
    wallets_analyzed = len(demo_wallets)
    users_protected = len(set(w.lower() for w in demo_wallets))
    scams_detected = 0  # For now, unless tracked persistently

    return jsonify({
        'wallets_analyzed': wallets_analyzed,
        'users_protected': users_protected,
        'scams_detected': scams_detected
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Crypto wallet API is running (V2 + USD prices)'})

@app.route('/api/test-etherscan', methods=['GET'])
def test_etherscan():
    """Test if Etherscan V2 API is working"""
    test_address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    
    params = {
        'chainid': '1',
        'module': 'account',
        'action': 'balance',
        'address': test_address,
        'tag': 'latest',
        'apikey': ETHERSCAN_API_KEY
    }
    response = requests.get(ETHERSCAN_API, params=params)
    
    return jsonify({
        'api_version': 'V2',
        'status_code': response.status_code,
        'etherscan_response': response.json(),
        'api_key_used': ETHERSCAN_API_KEY[:10] + '...'
    })

if __name__ == '__main__':
    print("running")
    app.run(debug=True, port=5000)