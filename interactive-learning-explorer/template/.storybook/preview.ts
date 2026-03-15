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
  decorators: [
    (Story) => {
      document.documentElement.classList.add('dark')
      return Story()
    },
  ],
}
export default preview
