// NOWA Fee Calculator
class NOWAFeeCalculator {
  constructor() {
    this.init();
  }

  init() {
    this.createCalculatorSection();
  }

  createCalculatorSection() {
    const calculatorHTML = `
      <section id="fee-calculator" class="py-16 bg-gray-50">
        <div class="max-w-2xl mx-auto px-4">
          <div class="text-center mb-8" data-aos="fade-up">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Fee Calculator</h3>
            <p class="text-gray-600">See how much you save with NOWA's transparent pricing</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="200">
            <div class="mb-6">
              <label for="calc-amount" class="block text-sm font-medium text-gray-700 mb-2">Transaction Amount (KES)</label>
              <input type="number" id="calc-amount" placeholder="Enter amount" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200">
            </div>
            <button onclick="calculateFees()" class="w-full gradient-bg text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition duration-300 shadow-lg hover:scale-105 transform">
              Calculate Savings
            </button>
            <div id="calc-results" class="mt-6 hidden">
              <div class="space-y-4">
                <div class="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <div class="font-semibold text-emerald-800">NOWA Fee (0.5%)</div>
                    <div class="text-sm text-emerald-600">Secure, instant processing</div>
                  </div>
                  <div class="text-2xl font-bold text-emerald-800" id="nowa-fee">KES 0</div>
                </div>
                <div class="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <div class="font-semibold text-red-800">Traditional Fee (2.5%)</div>
                    <div class="text-sm text-red-600">High fees, slow processing</div>
                  </div>
                  <div class="text-2xl font-bold text-red-800" id="trad-fee">KES 0</div>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div class="text-sm text-green-600 mb-1">You Save</div>
                  <div class="text-3xl font-bold text-green-800" id="savings">KES 0</div>
                  <div class="text-sm text-green-600 mt-1">per transaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Insert before contact section
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.insertAdjacentHTML('beforebegin', calculatorHTML);
    }
  }

  calculateFees() {
    const amountInput = document.getElementById('calc-amount');
    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const nowaFee = amount * 0.005; // 0.5%
    const tradFee = amount * 0.025; // 2.5%
    const savings = tradFee - nowaFee;

    document.getElementById('nowa-fee').textContent = `KES ${this.formatNumber(nowaFee)}`;
    document.getElementById('trad-fee').textContent = `KES ${this.formatNumber(tradFee)}`;
    document.getElementById('savings').textContent = `KES ${this.formatNumber(savings)}`;

    const results = document.getElementById('calc-results');
    results.classList.remove('hidden');

    // Animate results
    results.style.animation = 'none';
    setTimeout(() => {
      results.style.animation = 'fadeIn 0.5s ease-in-out';
    }, 10);
  }

  formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// Global function for onclick
function calculateFees() {
  const calculator = new NOWAFeeCalculator();
  calculator.calculateFees();
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NOWAFeeCalculator();
});