name: QA Spike (manuel)

on:
  workflow_dispatch:
    inputs:
      target_url:
        description: "URL du site à tester (ex: https://exemple.com)"
        required: true
      max_pages:
        description: "Nombre de pages max à tester"
        required: false
        default: "15"

jobs:
  spike:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run QA spike
        run: node scripts/qa-spike.mjs "${{ github.event.inputs.target_url }}" --max-pages=${{ github.event.inputs.max_pages }}

      - name: Upload report + screenshots
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: qa-spike-report
          path: .qa-spike-output/
          retention-days: 14
