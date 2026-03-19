import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: { test: 'todo' },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'dark', icon: 'moon', title: 'Dark' },
          { value: 'light', icon: 'sun', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark'
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.body.style.background = 'oklch(0.141 0.019 285.938)'
        document.body.style.color = 'oklch(0.985 0.002 286.375)'
      } else {
        document.documentElement.classList.remove('dark')
        document.body.style.background = 'oklch(1 0 0)'
        document.body.style.color = 'oklch(0.145 0.017 285.823)'
      }
      return Story()
    },
  ],
}
export default preview
