# **Career Catalogue MVP — Functional Flow Specification (FR-01 to FR-04)**

> Purpose: Explain the flow and features of FR-01 through FR-04 in detail so that an AI tool or developer can implement the correct behavior without adding unrequested features.  
> Scope: Only what is stated in FR-01 to FR-04. No search, no advanced filters, no pagination, no account requirements, no extra screens.

---

## **FR-01 — Onboard and Explore the Career Catalogue**

## **What This Feature Does**

Allows users to:

1. Choose a career level (university student, recent graduate, or early-career professional).  
2. Optionally provide education, experience, skills, and career interests to get a filtered/prioritized view of careers.  
3. Browse the career catalogue and open individual career details.  
4. See appropriate messages when the catalogue is loading, empty, or fails to load.

## **User Flow**

**Step 1: Choose a level**

* Before seeing the catalogue, the user selects one of:  
  * University student  
  * Recent graduate  
  * Early-career professional  
* This selection does not lock responses. The user can change their level at any time while browsing, and the catalogue view updates immediately.  
* This input does not require an account. An anonymous/guest user can select and change levels freely.

**Step 2: Optionally provide additional information**

* The user may choose to input:  
  * Education (e.g., degree, field of study)  
  * Experience (e.g., years of work, internships)  
  * Skills (e.g., JavaScript, Python, design)  
  * Career interests (e.g., "data science", "frontend development", "product management")  
* This step is optional. The user can skip it entirely.  
* If the user skips this step, they see the full unfiltered catalogue   
* If the user provides this information, the catalogue shows a filtered/prioritized view based on their inputs.  
* This input does not require an account.

**Step 3: Browse the catalogue**

* The catalogue displays as a list or grid of career cards.  
* Each card shows:  
  * A title (the career name)  
  * A concise description (a short summary of the role)  
* Only published careers appear. Draft or retired careers never show up.  
* The user can click/tap any card to open the full career details (FR-02).  
* Browsing works on both web and mobile.

**Step 4: Handle special states**

* **Loading state**: While the catalogue is being fetched, show a loading indicator (e.g., spinner or skeleton cards) with text explaining that careers are loading.  
* **Empty state (no careers at all)**: If the catalogue has zero published careers, show a message explaining that no careers are available yet, with no option to clear filters (because there are no careers to filter).  
* **Empty state (filtered to zero)**: If the user's level or interest filters return zero results, but the catalogue does have careers, show a message explaining that no careers match their filters, and provide an option to clear filters and see the full catalogue.  
* **Error state**: If the catalogue fails to load (network error, server error), show a message explaining that something went wrong and provide a retry action.

## **Important Rules for FR-01**

1. **Level selection is always changeable.** It is not a one-time onboarding step. The user can switch levels as many times as they want, and the catalogue updates each time.  
2. **Optional input is truly optional.** Skipping education/experience/skills/interests does not block access to the catalogue. It simply shows the full unfiltered list instead of a prioritized subset.  
3. **No account required.** None of the onboarding inputs (level, education, experience, skills, interests) require the user to have an account. Anonymous users can do everything in FR-01.  
4. **Session-only persistence.** The onboarding input (level, education, experience, skills, interests) is not persisted beyond the current browsing session. If the user closes the browser/app and returns later, their previous inputs are gone. If they later create an account or sign in, they must re-enter this information during profile setup — it does not carry over from their anonymous session.  
5. **Only published careers appear.** Retired careers are excluded from the catalogue entirely. Draft careers also do not appear.  
6. **No search, no advanced filters, no pagination (for MVP).** These are optional and should not be built until the catalogue grows large enough to need them. Do not add them unless explicitly told to do so.

---

## **FR-02 — Understand a Career and Its Outlook**

## **What This Feature Does**

Allows users to view detailed information about a specific career, including:

* A summary of the role  
* Example work activities  
* Entry considerations (what it takes to get into this role)  
* A linked roadmap (FR-03)  
* Salary and employment outlook information (with clear sourcing and labeling)

## **User Flow**

**Step 1: Open a career from the catalogue**

* From the FR-01 catalogue, the user clicks/taps a career card.  
* This opens the career detail page (FR-02) on both web and mobile.

**Step 2: View career details**

* The career detail page contains the following sections, in order:  
  1. **Role summary**: A paragraph explaining what people in this role do.  
  2. **Example work activities**: A list of typical tasks or projects someone in this role would work on.  
  3. **Entry considerations**: Information about what it takes to enter this role (e.g., typical education paths, skills needed, certifications, etc.).  
  4. **Linked roadmap**: A link or button that takes the user to the roadmap for this career (FR-03).  
  5. **Salary and outlook information**: Statistics about pay and employment projections (see detailed rules below).

**Step 3: View salary and outlook statistics**

* Each statistic (e.g., median salary, employment growth projection, demand indicator) is displayed with the following metadata:  
  * **Source**: Where the data came from (e.g., "U.S. Bureau of Labor Statistics", "LinkedIn Economic Graph").  
  * **Relevant period**: The time period the data covers (e.g., "May 2024", "2020–2030").  
  * **Geography**: The location the data applies to (e.g., "United States", "Lagos, Nigeria"). Data from different geographies is not blended into a single number.  
  * **Meaning**: A plain-language label explaining what the statistic represents (e.g., "Median annual salary", "Projected 10-year employment growth").  
* If a value is missing, it shows an explicit "unavailable" state — not zero, not a blank space, not a loading spinner.

**Step 4: Understand salary information**

* Salary values always identify:  
  * **Currency** (e.g., "USD", "NGN")  
  * **Pay period** (e.g., "per year", "per month", "per hour")  
* Where known, salary values also include:  
  * **Experience level** (e.g., "entry-level", "mid-career", "senior")  
  * **Gross/net basis** (e.g., "gross", "net"). If unknown, this is labeled as **"unspecified"**.  
* **Median salary** is shown as a single labeled value (e.g., "Median: $75,000/year"). It is never presented as a range (e.g., never "$60,000–$90,000" if the source only gave a median).  
* **Salary bands or percentiles** (e.g., 25th–75th percentile) are shown as a range with both bounds labeled, distinct from any median shown alongside them.  
* **Median is not entry-level.** A median must not be presented as an entry-level salary unless the source explicitly scoped it that way.

**Step 5: Understand outlook information**

* Employment projections (e.g., "Projected 10-year growth: 8%") and demand indicators (e.g., "Current demand: High") are presented as separate statistics from salary.  
* Current pay and future employment growth are never blended into a single figure or card.  
* If a trend chart is shown (e.g., salary over time, employment growth over time), it is only shown if the source data explicitly supports that exact interpretation (i.e., the source itself is a time series or projection series). A single-point estimate is never visually extrapolated into a chart.

## **Important Rules for FR-02**

1. **Career details are never gated.** The user can view all of FR-02's content (role summary, activities, entry considerations, roadmap link, salary/outlook) without having provided level, education, experience, skills, or interests during onboarding. None of this content is blocked behind FR-01's input.  
2. **Missing values show "unavailable".** If a statistic (salary, projection, etc.) is missing from the source data, render an explicit "unavailable" state for that field — never `0`, never a blank that looks like a loading state, never omit the card silently.  
3. **Geographies are not blended.** If salary data exists for multiple countries, do not average them or combine them into a "global" estimate. Show each geography's data separately with its own label.  
4. **Median vs. range are distinct.** A median is a single number. A range (e.g., 25th–75th percentile) is two numbers. Never visually merge them into one figure or relabel a median as a range.  
5. **No fabricated trends.** Do not create a trend chart from a single data point. Only show a chart if the source explicitly provides time-series or projection data that supports that interpretation.

---

## **FR-03 — Follow a Roadmap**

## **What This Feature Does**

Allows users to view and follow a structured learning roadmap for a specific career. Each roadmap consists of ordered steps, and each step explains what the user will learn, what they need before starting, and what activity or evidence demonstrates completion.

## **User Flow**

**Step 1: Open the roadmap from a career detail**

* From FR-02 (career detail), the user clicks/taps the "View roadmap" link or button.  
* This opens the roadmap view (FR-03) for that specific career.

**Step 2: View the roadmap steps**

* The roadmap displays as an ordered list of steps.  
* Each step has:  
  * A **stable, unique identifier** (step ID) — not an array index, since steps could be reordered or edited later.  
  * A **learning objective**: what the user will be able to do after completing this step.  
  * **Prerequisites** (if any): knowledge, skills, or prior steps needed before starting this step.  
  * **Expected activity or evidence**: a description of what the user should do to demonstrate learning (e.g., "build a working portfolio project", "pass a scored quiz", "complete a certified course").  
* Steps are shown in a recommended order, but the user can **inspect later steps** — they are not hidden or locked unless a specific prerequisite is explicitly marked as required.

**Step 3: Understand time estimates (if provided)**

* Some steps may include an estimated learning time (e.g., "≈20 hours").  
* When shown, the estimate **must state its assumptions**, such as:  
  * Prior knowledge assumed (e.g., "assuming no prior JavaScript knowledge")  
  * Weekly study time assumed (e.g., "at 5 hours/week")  
* If the source does not provide assumptions, do not fabricate them. Either show the estimate with its assumptions intact, or omit the estimate entirely — never show a bare number like "20 hours" without context.

**Step 4: Navigate between steps**

* The user can click/tap any step to view its details (including linked learning resources from FR-04).  
* The initial roadmap recommends an order, but does **not force completion gates** — the user can jump to any step unless a specific prerequisite is explicitly justified (i.e., marked as `requiredPrerequisiteStepId` in the data).

## **Important Rules for FR-03**

1. **Steps have stable IDs.** Each step is identified by a unique, stable `stepId` — not by its position in the list. This allows steps to be reordered or edited without breaking links or references.  
2. **Prerequisites are optional.** Not every step has prerequisites. Only show a prerequisites section if the step has non-empty prerequisites.  
3. **Time estimates include assumptions.** If an estimate is shown, it must include the assumptions (prior knowledge, weekly study time) that the source provides. If no assumptions exist, omit the estimate rather than showing an unqualified number.  
4. **No forced completion gates.** The roadmap recommends an order, but the user can browse any step freely unless a specific prerequisite is explicitly marked as required in the data.  
5. **Retired careers have no roadmap.** If a career is retired, it is excluded from new selection (FR-01), and its roadmap should not be accessible for new users.

---

## **FR-04 — Open Curated Learning Resources**

## **What This Feature Does**

Allows users to view and access learning resources linked to each roadmap step. Each resource is labeled with its title, provider, destination link, and cost (free/paid/unknown). Resources can be reported if broken or unsuitable.

## **User Flow**

**Step 1: Open resources from a roadmap step**

* From FR-03 (roadmap step detail), the user clicks/taps the "View resources" button.  
* This opens a list of learning resources linked to that specific step.

**Step 2: View resource details**

* Each resource card displays:  
  * **Title**: the name of the course, article, video, or other learning material.  
  * **Provider**: who created or hosts the resource (e.g., "freeCodeCamp", "Coursera", "YouTube").  
  * **Destination link**: a working link to access the resource (works on both web and mobile).  
  * **Cost label**: one of `free`, `paid`, or `unknown` — always show one of these three, never leave blank.  
* If the resource has a separate **certification or exam cost** (distinct from course access), show **two cost labels**:  
  * One for course access (e.g., "Course: free")  
  * One for certification/exam (e.g., "Certification: paid" or "Exam: $99")  
* Do not merge these into a single price or a single "paid" tag if the source distinguishes them.

**Step 3: Open a resource**

* Clicking/tapping the "Open resource" or "Go to course" button opens the `destinationLink`:  
  * On web: opens in a new browser tab.  
  * On mobile: opens in an in-app browser or external app (platform-appropriate).  
* After opening the link, the user can return to their roadmap — opening a resource does not navigate them away permanently.  
* Opening a link **does not automatically mark** the course or step as complete. Completion (if it exists elsewhere in the product) must be a separate, explicit user action.

**Step 4: Report a broken or unsuitable resource**

* Each resource card includes a visible (but low-emphasis) action: "Report an issue with this resource".  
* Submitting a report does **not** remove the resource from view immediately for the reporting user.  
* Withdrawal or replacement of the resource happens through content maintenance (a separate, presumably admin-side flow), not as a live client-side removal.

**Step 5: Content reviewer metadata (backend/content-ops only)**

* Each resource has underlying metadata that is not shown to the learner by default:  
  * **Reviewer note**: why this resource belongs to this step (e.g., "covers exactly the React hooks concepts needed for this step").  
  * **Last checked date**: when the link was last verified as working (e.g., "2024-11-15").  
* This metadata is used for content maintenance, not for the learner-facing UI — but the field must exist in the data model.

## **Important Rules for FR-04**

1. **Links work on both clients.** External links must work identically on web and mobile — no dead-ends, no platform-specific failures.  
2. **Opening a link is non-destructive.** The user can return to their roadmap after opening a resource link. It does not auto-mark the step or resource as complete.  
3. **Cost labels are always present.** Every resource shows one of `free`, `paid`, or `unknown` for course access — never leave this blank.  
4. **Certification cost is separate if applicable.** If the source distinguishes course access cost from certification/exam cost, show both labels separately — do not merge into one.  
5. **Broken resources can be reported.** Users can report broken or unsuitable resources, but removal/replacement happens through content maintenance, not live client-side logic.

---

## **Cross-FR Rules (Apply to All Features)**

1. **No account required for FR-01 to FR-04.** All of these features work fully for anonymous/guest users. Never render an auth wall, login modal, or "sign in to continue" blocker on these flows.  
2. **Session-only state.** Level, education, experience, skills, and interests entered during browsing live only in client-side session state (e.g., in-memory store or `sessionStorage`). Never persist to a backend or long-term storage tied to an anonymous user. If the user later signs in, this data is discarded — profile setup collects it again from scratch.  
3. **Published-only content.** Only entities with `status: "published"` appear in lists or detail views. Retired careers (`status: "retired"`) never appear in new selection UI, even if linked from history.  
4. **Never fabricate data.** If a field (salary, projection, resource cost, step estimate) is missing from the source payload, render the explicit "unavailable" state for that field  never `0`, never a blank that looks like a loading state, never omit silently.  
5. **Separate distinct concepts visually.** Never merge: (a) median vs. range salary, (b) current pay vs. future projection, (c) different geographies' figures into one blended number. If the UI shows two stats together, label each independently with its own source/period/geography tag.

