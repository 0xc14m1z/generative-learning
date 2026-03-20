import type { Meta, StoryObj } from '@storybook/react-vite'

const ContentWrapper = ({ html }: { html: string }) => (
  <div className="max-w-2xl">
    <div className="level-content text-[15.5px] leading-[1.75]" dangerouslySetInnerHTML={{ __html: html }} />
  </div>
)

const meta: Meta<typeof ContentWrapper> = {
  title: 'Content Patterns',
  component: ContentWrapper,
}
export default meta

// ─── Callouts ───────────────────────────────────────────────────
export const CalloutInsight: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <p>Regular paragraph text before the callout. This provides context.</p>
    <div class="callout" data-type="insight">
      The 80/20 rule applies to learning: roughly 20% of concepts account for 80% of practical use cases. Focus on those first.
    </div>
    <p>Regular paragraph continues after the callout.</p>
  `} />,
}

export const CalloutTip: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <div class="callout" data-type="tip">
      Start with room-temperature butter. Cold butter won't cream properly, and melted butter will make the cookies flat.
    </div>
  `} />,
}

export const CalloutWarning: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <div class="callout" data-type="warning">
      Never invest money you can't afford to lose. Emergency fund first, investments second.
    </div>
  `} />,
}

export const CalloutQuote: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <div class="callout" data-type="quote">
      "The only way to do great work is to love what you do." — Steve Jobs
    </div>
  `} />,
}

export const AllCallouts: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <p>Here are all four callout types used together in a section about cooking:</p>
    <div class="callout" data-type="insight">
      Salt doesn't just add saltiness — it enhances other flavors and suppresses bitterness. This is why a pinch of salt improves chocolate desserts.
    </div>
    <div class="callout" data-type="tip">
      Season in layers. Add a little salt at each stage of cooking rather than all at the end. This builds depth of flavor.
    </div>
    <div class="callout" data-type="warning">
      Be careful with salt in doughs and batters — too much can inhibit yeast activity and toughen gluten. Measure precisely.
    </div>
    <div class="callout" data-type="quote">
      "A recipe has no soul. You, as the cook, must bring soul to the recipe." — Thomas Keller
    </div>
  `} />,
}

// ─── Do / Don't ─────────────────────────────────────────────────
export const DoDont: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <p>When presenting to an audience:</p>
    <div class="do-dont">
      <div class="do">
        Make eye contact with different sections of the room. Pause after key points. Use simple, concrete language.
      </div>
      <div class="dont">
        Read directly from slides. Apologize for being nervous. Use jargon without explaining it.
      </div>
    </div>
  `} />,
}

export const DoDontCooking: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <h3>Knife Skills</h3>
    <div class="do-dont">
      <div class="do">
        Curl your fingers into a "claw" grip. Let the blade guide against your knuckles. Keep the knife sharp — dull knives slip.
      </div>
      <div class="dont">
        Cut towards your body. Leave knives loose on the counter. Put sharp knives in a sink full of water.
      </div>
    </div>
  `} />,
}

// ─── Steps ──────────────────────────────────────────────────────
export const StepsBasic: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <h3>Making Fresh Pasta</h3>
    <div class="steps">
      <div class="step" data-time="5 min">Mound 400g flour on a clean surface. Create a well in the center and crack in 4 eggs.</div>
      <div class="step" data-time="10 min">Using a fork, gradually incorporate flour from the edges into the eggs. Switch to kneading by hand when it forms a shaggy dough.</div>
      <div class="step" data-time="10 min">Knead the dough for 8-10 minutes until smooth and elastic. It should bounce back when poked.</div>
      <div class="step" data-time="30 min">Wrap tightly in plastic and rest at room temperature for at least 30 minutes.</div>
      <div class="step" data-time="15 min">Divide into portions and roll through a pasta machine, starting at the widest setting and narrowing gradually.</div>
    </div>
  `} />,
}

export const StepsNoTime: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <h3>Setting Up Your Budget</h3>
    <div class="steps">
      <div class="step">List all sources of monthly income after taxes.</div>
      <div class="step">Track every expense for one full month — every coffee, every subscription.</div>
      <div class="step">Categorize expenses: needs (50%), wants (30%), savings (20%).</div>
      <div class="step">Set up automatic transfers to savings on payday.</div>
      <div class="step">Review and adjust at the end of each month.</div>
    </div>
  `} />,
}

// ─── Mixed Content ──────────────────────────────────────────────
export const MixedContentSection: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <h3>The Art of Sourdough</h3>
    <p>Sourdough bread relies on <strong>wild yeast</strong> and <strong>lactic acid bacteria</strong> rather than commercial yeast. The process is slower but produces complex flavors and better digestibility.</p>

    <div class="callout" data-type="insight">
      The "sour" in sourdough comes from lactic and acetic acid produced by bacteria. Temperature controls the balance: warmer fermentation favors lactic acid (mild, yogurty), while cooler fermentation favors acetic acid (sharp, vinegary).
    </div>

    <h3>Basic Process</h3>
    <div class="steps">
      <div class="step" data-time="5 min">Mix 100g active starter with 375g water and 500g bread flour. Add 10g salt.</div>
      <div class="step" data-time="4 hrs">Bulk ferment at room temperature. Perform stretch-and-folds every 30 minutes for the first 2 hours.</div>
      <div class="step" data-time="12 hrs">Shape the dough and cold-proof in the refrigerator overnight.</div>
      <div class="step" data-time="45 min">Bake in a preheated Dutch oven at 250°C: 20 min covered, 25 min uncovered.</div>
    </div>

    <div class="do-dont">
      <div class="do">
        Use the "poke test" to check readiness: press the dough gently — if it springs back slowly, it's ready. Use a kitchen scale for consistency.
      </div>
      <div class="dont">
        Rush the bulk ferment. Skip the overnight cold proof — it develops flavor. Open the oven during the first 20 minutes.
      </div>
    </div>

    <div class="callout" data-type="tip">
      If your starter isn't rising consistently, try feeding it twice a day with equal parts flour and water at a 1:1:1 ratio (starter:flour:water by weight).
    </div>
  `} />,
}

// ─── Key Takeaway ───────────────────────────────────────────────
export const KeyTakeaway: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <p>We covered a lot in this section about compound interest and long-term investing.</p>
    <div class="takeaway">
      <ul>
        <li>Start investing as early as possible — time in the market beats timing the market</li>
        <li>Compound interest grows exponentially: $10K at 7% becomes $76K in 30 years</li>
        <li>Keep fees below 0.5% — high fees compound against you just like returns compound for you</li>
      </ul>
    </div>
  `} />,
}

export const KeyTakeawaySingle: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <div class="takeaway">
      The single most important principle: <strong>consistency beats intensity</strong>. 20 minutes of daily practice outperforms 3-hour weekend sessions every time.
    </div>
  `} />,
}

// ─── Vocabulary Grid ────────────────────────────────────────────
export const VocabGrid: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <h3>Essential Terms</h3>
    <div class="vocab-grid">
      <div class="vocab-term" data-term="CAGR">Compound Annual Growth Rate — the mean annual growth rate over a period longer than one year.</div>
      <div class="vocab-term" data-term="P/E Ratio">Price-to-Earnings Ratio — stock price divided by earnings per share. Measures how expensive a stock is.</div>
      <div class="vocab-term" data-term="ETF">Exchange-Traded Fund — a basket of securities that trades like a single stock on an exchange.</div>
      <div class="vocab-term" data-term="Dividend">A portion of a company's earnings paid to shareholders, usually quarterly.</div>
      <div class="vocab-term" data-term="Bull Market">A period of rising prices, typically 20%+ gain from recent lows.</div>
      <div class="vocab-term" data-term="Bear Market">A period of falling prices, typically 20%+ decline from recent highs.</div>
    </div>
  `} />,
}

// ─── Practice Block ────────────────────────────────────────────
export const PracticeBlock: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <section class="practice-block">
      <p class="prompt">You have a recipe that serves 4, but you need to serve 6. The recipe calls for 2¾ cups of flour. How much flour do you need?</p>
      <details class="solution">
        <summary>Show answer</summary>
        <p>4⅛ cups — multiply 2¾ by 1.5 (the ratio of 6÷4). Convert: 2.75 × 1.5 = 4.125 cups, or 4⅛ cups.</p>
      </details>
    </section>
  `} />,
}

export const PracticeBlockFinance: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <section class="practice-block">
      <p class="prompt">If you invest $500/month at 7% annual return for 20 years, roughly how much will you have?</p>
      <details class="solution">
        <summary>Show answer</summary>
        <p>Approximately $260,000. You contributed $120,000 total ($500 × 240 months), meaning compound growth more than doubled your money.</p>
      </details>
    </section>
  `} />,
}

// ─── Worked Example ────────────────────────────────────────────
export const WorkedExample: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <section class="worked-example">
      <div class="problem">A sweater originally costs $80. It's marked 30% off, and you have a coupon for an additional 15% off the sale price. What do you pay?</div>
      <ol class="steps">
        <li>Calculate the first discount: $80 × 0.30 = $24 off</li>
        <li>Sale price: $80 − $24 = $56</li>
        <li>Apply the coupon: $56 × 0.15 = $8.40 off</li>
        <li>Final price: $56 − $8.40 = $47.60</li>
      </ol>
      <div class="answer">$47.60</div>
      <details class="why"><summary>Why this works</summary><p>Stacked discounts are applied sequentially, not added together. A 30% + 15% discount is not 45% off the original — the second discount applies to the already-reduced price.</p></details>
    </section>
  `} />,
}

export const WorkedExampleFitness: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <section class="worked-example">
      <div class="problem">Calculate your daily calorie needs. You weigh 70 kg, are 175 cm tall, 30 years old (male), and exercise 3 days/week.</div>
      <ol class="steps">
        <li>Basal Metabolic Rate (Mifflin-St Jeor): 10 × 70 + 6.25 × 175 − 5 × 30 − 5</li>
        <li>BMR = 700 + 1093.75 − 150 − 5 = 1,638.75</li>
        <li>Apply activity multiplier (moderate = 1.55): 1,638.75 × 1.55</li>
      </ol>
      <div class="answer">~2,540 calories/day</div>
      <details class="why"><summary>Why this works</summary><p>The Mifflin-St Jeor equation estimates energy burned at rest, then the activity multiplier scales it based on exercise level. It's the most accurate predictive equation for most adults.</p></details>
    </section>
  `} />,
}

// ─── Formula Card ──────────────────────────────────────────────
export const FormulaCard: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <figure class="formula-card">
      <div class="formula">A = P(1 + r)<sup>t</sup></div>
      <dl class="symbols">
        <dt>A</dt><dd>Final amount</dd>
        <dt>P</dt><dd>Principal (initial investment)</dd>
        <dt>r</dt><dd>Annual interest rate (decimal)</dd>
        <dt>t</dt><dd>Time in years</dd>
      </dl>
      <figcaption class="when-to-use">Use when interest compounds annually. For monthly compounding, divide r by 12 and multiply t by 12.</figcaption>
    </figure>
  `} />,
}

export const FormulaCardCooking: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <figure class="formula-card">
      <div class="formula">T<sub>adj</sub> = T<sub>orig</sub> × (V<sub>new</sub> / V<sub>orig</sub>)</div>
      <dl class="symbols">
        <dt>T<sub>adj</sub></dt><dd>Adjusted ingredient amount</dd>
        <dt>T<sub>orig</sub></dt><dd>Original ingredient amount</dd>
        <dt>V<sub>new</sub></dt><dd>Desired number of servings</dd>
        <dt>V<sub>orig</sub></dt><dd>Original number of servings</dd>
      </dl>
      <figcaption class="when-to-use">Use for scaling any recipe up or down. Works for all ingredients, but note that spices and leaveners may not scale linearly at large multiples.</figcaption>
    </figure>
  `} />,
}

// ─── Misconception Clinic ──────────────────────────────────────
export const MisconceptionClinic: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <section class="misconception">
      <div class="wrong">"Muscle turns into fat when you stop exercising."</div>
      <div class="why-wrong">Muscle and fat are different tissue types. Muscle cannot transform into fat any more than bone can transform into skin.</div>
      <div class="fix">What actually happens: muscle atrophies (shrinks) from disuse while fat may accumulate from unchanged calorie intake. They are independent processes.</div>
    </section>
  `} />,
}

export const MisconceptionClinicCooking: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <section class="misconception">
      <div class="wrong">"Searing meat seals in the juices."</div>
      <div class="why-wrong">This was disproven in the 1930s. Seared meat actually loses slightly more moisture than meat cooked gently, because high heat causes more muscle fiber contraction.</div>
      <div class="fix">Searing creates the Maillard reaction — a chemical browning that produces hundreds of new flavor compounds on the surface. The benefit is flavor, not moisture retention.</div>
    </section>
  `} />,
}

export const MisconceptionClinicFinance: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <section class="misconception">
      <div class="wrong">"You need to pay off all debt before you start investing."</div>
      <div class="why-wrong">Not all debt is equal. Low-interest debt (like a 3% mortgage) costs less than the historical average stock market return (~7-10%). Waiting years to invest means missing out on compound growth.</div>
      <div class="fix">Prioritize high-interest debt (credit cards, payday loans) aggressively. For low-interest debt, balance minimum payments with investing — especially if your employer matches retirement contributions.</div>
    </section>
  `} />,
}

// ─── Reference Matrix ──────────────────────────────────────────
export const ReferenceMatrix: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <h3>Spanish Verb Conjugation: Hablar (to speak)</h3>
    <table class="reference-matrix">
      <thead><tr><th></th><th>Present</th><th>Preterite</th><th>Future</th></tr></thead>
      <tbody>
        <tr><th>Yo</th><td>hablo</td><td>hablé</td><td>hablaré</td></tr>
        <tr><th>Tú</th><td>hablas</td><td>hablaste</td><td>hablarás</td></tr>
        <tr><th>Él/Ella</th><td>habla</td><td>habló</td><td>hablará</td></tr>
        <tr><th>Nosotros</th><td>hablamos</td><td>hablamos</td><td>hablaremos</td></tr>
        <tr><th>Ellos</th><td>hablan</td><td>hablaron</td><td>hablarán</td></tr>
      </tbody>
    </table>
  `} />,
}

export const ReferenceMatrixCooking: StoryObj<typeof ContentWrapper> = {
  render: () => <ContentWrapper html={`
    <h3>Cooking Oil Smoke Points</h3>
    <table class="reference-matrix">
      <thead><tr><th>Oil</th><th>Smoke Point</th><th>Best For</th><th>Flavor</th></tr></thead>
      <tbody>
        <tr><th>Extra Virgin Olive</th><td>375°F / 190°C</td><td>Dressings, low-heat sauté</td><td>Fruity, peppery</td></tr>
        <tr><th>Butter</th><td>350°F / 175°C</td><td>Baking, finishing</td><td>Rich, creamy</td></tr>
        <tr><th>Coconut</th><td>350°F / 175°C</td><td>Baking, medium-heat sauté</td><td>Sweet, nutty</td></tr>
        <tr><th>Avocado</th><td>520°F / 270°C</td><td>Searing, grilling, frying</td><td>Mild, buttery</td></tr>
        <tr><th>Peanut</th><td>450°F / 230°C</td><td>Deep frying, stir-fry</td><td>Nutty</td></tr>
      </tbody>
    </table>
  `} />,
}
