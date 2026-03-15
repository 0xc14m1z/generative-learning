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
