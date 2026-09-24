import type { LearningResource, Roadmap } from './types'

/**
 * Deliberate edge cases:
 *  - fe-html: estimate WITH assumptions → shown
 *  - fe-css: estimate with assumptions: null → estimate must be omitted
 *  - fe-js: no prerequisites → no prerequisites section
 *  - fe-react: requiredPrerequisiteStepId set → the one justified gate
 *  - fe-portfolio: no resources linked yet
 */
export const roadmaps: Roadmap[] = [
  {
    id: 'rm-frontend',
    careerId: 'frontend-developer',
    title: 'Frontend Developer roadmap',
    steps: [
      {
        stepId: 'fe-html',
        title: 'HTML & accessibility foundations',
        learningObjective: 'Structure a web page with semantic HTML that works with screen readers and keyboards.',
        prerequisites: [],
        expectedEvidence: 'Build a single-page profile site that passes an automated accessibility check.',
        estimate: { hours: 20, assumptions: { priorKnowledge: 'No prior coding experience', weeklyStudyHours: 5 } },
        resourceIds: ['r-mdn-html', 'r-fcc-web', 'r-a11y-video'],
      },
      {
        stepId: 'fe-css',
        title: 'Layout with modern CSS',
        learningObjective: 'Lay out responsive pages with Flexbox and Grid that adapt from phone to desktop.',
        prerequisites: ['Comfortable writing semantic HTML'],
        expectedEvidence: 'Recreate a provided landing-page design at three screen sizes.',
        estimate: { hours: 25, assumptions: null },
        resourceIds: ['r-css-course', 'r-grid-game'],
      },
      {
        stepId: 'fe-js',
        title: 'JavaScript essentials',
        learningObjective: 'Write JavaScript that responds to user input and fetches data from an API.',
        prerequisites: [],
        expectedEvidence: 'Pass a scored quiz and build a small app that loads data from a public API.',
        estimate: { hours: 40, assumptions: { priorKnowledge: 'Assumes no prior JavaScript knowledge', weeklyStudyHours: 6 } },
        resourceIds: ['r-js-info', 'r-meta-cert'],
      },
      {
        stepId: 'fe-react',
        title: 'Building interfaces with React',
        learningObjective: 'Compose an interactive interface from reusable React components with state.',
        prerequisites: ['JavaScript essentials — functions, arrays and async code'],
        requiredPrerequisiteStepId: 'fe-js',
        expectedEvidence: 'Build a multi-screen React app with loading, empty and error states.',
        resourceIds: ['r-react-docs', 'r-meta-cert'],
      },
      {
        stepId: 'fe-portfolio',
        title: 'Portfolio & job readiness',
        learningObjective: 'Present your work so employers can quickly assess your skills.',
        prerequisites: ['At least two finished projects'],
        expectedEvidence: 'Publish a portfolio site with three projects and case-study write-ups.',
        resourceIds: [],
      },
    ],
  },
  {
    id: 'rm-data-analyst',
    careerId: 'data-analyst',
    title: 'Data Analyst roadmap',
    steps: [
      {
        stepId: 'da-sheets',
        title: 'Spreadsheets for analysis',
        learningObjective: 'Clean, summarise and chart data in a spreadsheet.',
        prerequisites: [],
        expectedEvidence: 'Produce a pivot-table summary of a provided dataset.',
        resourceIds: ['r-fcc-web'],
      },
      {
        stepId: 'da-sql',
        title: 'SQL fundamentals',
        learningObjective: 'Query and join relational data to answer business questions.',
        prerequisites: [],
        expectedEvidence: 'Answer ten questions against a sample database with SQL.',
        estimate: { hours: 15, assumptions: { weeklyStudyHours: 5 } },
        resourceIds: [],
      },
    ],
  },
]

export const resources: LearningResource[] = [
  {
    id: 'r-mdn-html', status: 'published', title: 'Learn web development: HTML basics', provider: 'MDN Web Docs', format: 'docs',
    destinationLink: 'https://developer.mozilla.org/en-US/docs/Learn', accessCost: 'free',
    reviewerNote: 'Canonical reference; covers semantics and landmarks needed for this step.', lastCheckedDate: '2025-08-14',
  },
  {
    id: 'r-fcc-web', status: 'published', title: 'Responsive Web Design', provider: 'freeCodeCamp', format: 'interactive',
    destinationLink: 'https://www.freecodecamp.org/learn', accessCost: 'free', certificationCost: { kind: 'Certification', cost: 'free' },
    reviewerNote: 'Hands-on exercises; certificate is free.', lastCheckedDate: '2025-08-14',
  },
  {
    id: 'r-a11y-video', status: 'published', title: 'Accessibility fundamentals in 30 minutes', provider: 'YouTube', format: 'video',
    destinationLink: 'https://www.youtube.com', accessCost: 'unknown',
    reviewerNote: 'Short primer; provider pricing unclear (channel membership content).', lastCheckedDate: '2025-07-02',
  },
  {
    id: 'r-css-course', status: 'published', title: 'CSS Layout Masterclass', provider: 'Coursera', format: 'course',
    destinationLink: 'https://www.coursera.org', accessCost: 'paid',
    reviewerNote: 'Covers Flexbox + Grid in depth.', lastCheckedDate: '2025-08-01',
  },
  {
    id: 'r-grid-game', status: 'published', title: 'Grid Garden', provider: 'Codepip', format: 'interactive',
    destinationLink: 'https://cssgridgarden.com', accessCost: 'free',
    reviewerNote: 'Playful practice for grid syntax.', lastCheckedDate: '2025-08-01',
  },
  {
    id: 'r-js-info', status: 'published', title: 'The Modern JavaScript Tutorial', provider: 'javascript.info', format: 'docs',
    destinationLink: 'https://javascript.info', accessCost: 'free',
    reviewerNote: 'Thorough and current; matches objective scope.', lastCheckedDate: '2025-08-10',
  },
  {
    id: 'r-meta-cert', status: 'published', title: 'Meta Front-End Developer Professional Certificate', provider: 'Coursera', format: 'course',
    destinationLink: 'https://www.coursera.org', accessCost: 'free', certificationCost: { kind: 'Certification', cost: 'paid', amount: '$49/month' },
    reviewerNote: 'Audit is free; certificate requires subscription.', lastCheckedDate: '2025-08-10',
  },
  {
    id: 'r-react-docs', status: 'published', title: 'react.dev — Learn React', provider: 'React', format: 'docs',
    destinationLink: 'https://react.dev/learn', accessCost: 'free',
    reviewerNote: 'Official docs; covers components, state and effects.', lastCheckedDate: '2025-08-10',
  },
]
