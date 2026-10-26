// Lighthouse CI budgets (docs/08-NFR.md §2): SEO ≥ 95, accessibility ≥ 95, performance ≥ 90 on public pages.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx next start -p 3220',
      startServerReadyPattern: 'Ready in',
      url: ['http://localhost:3220/vi', 'http://localhost:3220/vi/learn/n5/1', 'http://localhost:3220/vi/kanji/%E5%AD%A6', 'http://localhost:3220/en/words/jmdict-1206900'],
      numberOfRuns: 1,
      settings: { preset: 'desktop', chromeFlags: '--headless=new --no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
