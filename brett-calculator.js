// BRETT Token Calculator
// Calculates USD value using Market Cap or SOL Pair methods

const brettAmountInput = document.getElementById('brett-amount');
const marketCapInput = document.getElementById('market-cap-input');
const totalSupplyDisplay = document.getElementById('total-supply');
const usdValueDisplay = document.getElementById('usd-value');
const percentageOwnedDisplay = document.getElementById('percentage-owned');

// Comparison buttons
const ethMcBtn = document.getElementById('eth-mc-btn');
const baseMcBtn = document.getElementById('base-mc-btn');
const tokensPerSolInput = document.getElementById('tokens-per-sol');
const solPriceInput = document.getElementById('sol-price-input');

// Method buttons
const marketCapBtn = document.getElementById('method-marketcap');
const solPairBtn = document.getElementById('method-solpair');
const marketCapMethod = document.getElementById('marketcap-method');
const solPairMethod = document.getElementById('solpair-method');

// Default values
let currentMarketCap = 1000000; // Default market cap $1M
let totalSupply = 1000000000; // 1 billion BRETT tokens total supply
let tokensPerSol = 5000; // Default: 5000 tokens per 1 SOL
let solPrice = 180; // Default SOL price $180
let currentMethod = 'marketcap'; // Current calculation method

// ETH and BASE market cap data (ATH values)
let ethMc = 13800000; // $13.8M ETH ATH market cap
let baseMc = 915950000; // $915.95M BASE ATH market cap

// Initialize calculator
function initCalculator() {
    // Set default values
    marketCapInput.value = currentMarketCap;
    tokensPerSolInput.value = tokensPerSol;
    solPriceInput.value = solPrice;
    updateTotalSupplyDisplay();
    
    // Add event listeners
    brettAmountInput.addEventListener('input', calculateValue);
    marketCapInput.addEventListener('input', function() {
        currentMarketCap = parseFloat(this.value) || 0;
        calculateValue();
    });
    tokensPerSolInput.addEventListener('input', function() {
        tokensPerSol = parseFloat(this.value) || 0;
        calculateValue();
    });
    solPriceInput.addEventListener('input', function() {
        solPrice = parseFloat(this.value) || 0;
        calculateValue();
    });
    
    // Method switching
    marketCapBtn.addEventListener('click', function() {
        switchMethod('marketcap');
    });
    solPairBtn.addEventListener('click', function() {
        switchMethod('solpair');
    });
    
    // Comparison buttons
    ethMcBtn.addEventListener('click', function() {
        calculateBONKPriceAtMC(ethMc, 'ETH');
    });
    baseMcBtn.addEventListener('click', function() {
        calculateBONKPriceAtMC(baseMc, 'BASE');
    });
}

// Switch calculation method
function switchMethod(method) {
    currentMethod = method;
    
    // Update button states
    marketCapBtn.classList.toggle('active', method === 'marketcap');
    solPairBtn.classList.toggle('active', method === 'solpair');
    
    // Show/hide method sections
    marketCapMethod.style.display = method === 'marketcap' ? 'block' : 'none';
    solPairMethod.style.display = method === 'solpair' ? 'block' : 'none';
    
    // Recalculate
    calculateValue();
}

// Update total supply display
function updateTotalSupplyDisplay() {
    totalSupplyDisplay.textContent = totalSupply.toLocaleString('en-US');
}

// Calculate USD value of BRETT tokens
function calculateValue() {
    const brettAmount = parseFloat(brettAmountInput.value) || 0;
    let usdValue = 0;
    
    // Calculate percentage owned (same for both methods)
    const ownershipPercentage = brettAmount / totalSupply;
    updatePercentageDisplay(ownershipPercentage);
    
    if (currentMethod === 'marketcap') {
        // Market Cap Method
        const marketCap = parseFloat(marketCapInput.value) || 0;
        usdValue = ownershipPercentage * marketCap;
        
        console.log(`Market Cap Method: ${brettAmount.toLocaleString()} BRETT / ${totalSupply.toLocaleString()} = ${(ownershipPercentage * 100).toFixed(4)}% of $${marketCap.toLocaleString()} = $${usdValue.toFixed(2)}`);
        
    } else if (currentMethod === 'solpair') {
        // SOL Pair Method
        const tokenPriceInSol = 1 / tokensPerSol; // Price per token in SOL
        const tokenPriceInUsd = tokenPriceInSol * solPrice; // Price per token in USD
        usdValue = brettAmount * tokenPriceInUsd;
        
        console.log(`SOL Pair Method: 1/${tokensPerSol} = ${tokenPriceInSol.toFixed(6)} SOL per token`);
        console.log(`Token price: ${tokenPriceInSol.toFixed(6)} SOL × $${solPrice} = $${tokenPriceInUsd.toFixed(6)} per token`);
        console.log(`Total value: ${brettAmount.toLocaleString()} tokens × $${tokenPriceInUsd.toFixed(6)} = $${usdValue.toFixed(2)}`);
    }
    
    // Format the result
    if (usdValue === 0) {
        usdValueDisplay.textContent = '$0.00';
    } else if (usdValue < 0.01) {
        usdValueDisplay.textContent = `$${usdValue.toFixed(6)}`;
    } else if (usdValue < 1) {
        usdValueDisplay.textContent = `$${usdValue.toFixed(4)}`;
    } else if (usdValue < 1000) {
        usdValueDisplay.textContent = `$${usdValue.toFixed(2)}`;
    } else {
        usdValueDisplay.textContent = `$${usdValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

// Update percentage display
function updatePercentageDisplay(percentage) {
    const percentageValue = percentage * 100;
    
    if (percentageValue === 0) {
        percentageOwnedDisplay.textContent = '0.0000%';
    } else if (percentageValue < 0.0001) {
        percentageOwnedDisplay.textContent = `${percentageValue.toFixed(6)}%`;
    } else if (percentageValue < 0.01) {
        percentageOwnedDisplay.textContent = `${percentageValue.toFixed(4)}%`;
    } else if (percentageValue < 1) {
        percentageOwnedDisplay.textContent = `${percentageValue.toFixed(3)}%`;
    } else {
        percentageOwnedDisplay.textContent = `${percentageValue.toFixed(2)}%`;
    }
}

// Calculate BONK price if it reached a specific market cap
function calculateBONKPriceAtMC(targetMc, chainName) {
    // BONK total supply (you can update this with actual BONK supply)
    const bonkSupply = 1000000000000; // Example: 1 trillion BONK tokens
    
    // Calculate price per BONK token at target market cap
    const bonkPrice = targetMc / bonkSupply;
    
    // Update the market cap input to show the target
    marketCapInput.value = targetMc;
    
    // Update button states
    ethMcBtn.classList.toggle('active', chainName === 'ETH');
    baseMcBtn.classList.toggle('active', chainName === 'BASE');
    
    // Trigger calculation with new market cap
    calculateValue();
    
    // Show alert with BONK price
    const formattedPrice = formatPrice(bonkPrice);
    const formattedMc = targetMc >= 1000000 ? `$${(targetMc / 1000000).toFixed(2)}M` : `$${(targetMc / 1000).toFixed(2)}K`;
    
    alert(`If BONK reached ${chainName} market cap (${formattedMc}):\nBONK price would be $${formattedPrice} per token`);
    
    console.log(`BONK at ${chainName} MC (${formattedMc}): $${formattedPrice} per token`);
}

// Add some example calculations for user reference
function addExamples() {
    const examples = [
        { brett: 1000000, description: '1M BRETT' },
        { brett: 100000, description: '100K BRETT' },
        { brett: 10000, description: '10K BRETT' },
        { brett: 1000, description: '1K BRETT' }
    ];
    
    console.log('Example calculations:');
    console.log('Market Cap Method ($1M market cap):');
    examples.forEach(example => {
        const ownershipPercentage = example.brett / totalSupply;
        const usdValue = ownershipPercentage * 1000000;
        console.log(`${example.description}: $${usdValue.toFixed(2)} USD`);
    });
    
    console.log('SOL Pair Method (5000 tokens per SOL, $180 SOL):');
    examples.forEach(example => {
        const tokenPriceInSol = 1 / 5000;
        const tokenPriceInUsd = tokenPriceInSol * 180;
        const usdValue = example.brett * tokenPriceInUsd;
        console.log(`${example.description}: $${usdValue.toFixed(2)} USD`);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
    
    // Add some helpful placeholder text
    brettAmountInput.placeholder = 'e.g., 1000000 for 1M BRETT tokens';
    marketCapInput.placeholder = 'e.g., 1000000 for $1M market cap';
    tokensPerSolInput.placeholder = 'e.g., 5000 tokens for 1 SOL';
    solPriceInput.placeholder = 'e.g., 180 for $180 SOL price';
    
    // Focus on the input for better UX
    brettAmountInput.focus();
    
    // Add example calculations
    addExamples();
    
    // Handle intro modal
    const introModal = document.getElementById('intro-modal');
    const closeIntroBtn = document.getElementById('close-intro-btn');
    
    if (closeIntroBtn) {
        closeIntroBtn.addEventListener('click', function() {
            introModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    introModal.addEventListener('click', function(e) {
        if (e.target === introModal) {
            introModal.style.display = 'none';
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to focus on market cap input
    if (e.key === 'Enter' && document.activeElement === brettAmountInput) {
        marketCapInput.focus();
        e.preventDefault();
    }
    
    // Escape key to clear inputs
    if (e.key === 'Escape') {
        brettAmountInput.value = '';
        marketCapInput.value = currentMarketCap;
        calculateValue();
        brettAmountInput.focus();
    }
}); 