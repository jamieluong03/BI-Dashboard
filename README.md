# Business Analytics Dashboard (Active Development)

A performance dashboard designed to help businesses visualize key performance indicators (KPIs) through interactive data visualizations. This project was born out of a real-world pain point: the gap between standard platform analytics and deep business intelligence. While platforms provide excellent foundational tools, the pre-defined data sets and limited customization often leave specific business questions unanswered—forcing companies to rely on third-party plugins that can degrade site performance. My goal is to provide that deep customization without the technical overhead.

### Tech Stack
- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Database/Backend:** Supabase (PostgreSQL)
- **Data Fetching:** TanStack Query (React Query)
- **Visualization:** Recharts with shadcn/ui

### Key Features
- Dynamic Data Fetching: Optimized server-side rendering with Next.js and Supabase for near-instant data loading.
- Custom SQL Aggregations: Using raw SQL to calculate complex metrics like adSpend vs. Revenue, bypasssing standard API limitations.
- Responsive Visualization: A mobile-first approach to complex data tables and charts.

### Roadmap
- [x] Write & Initialize Supabase schema. Generate test data.
- [x] Create SQL views to make basic KPI cards.
- [ ] Implement drill-down analytics per KPI card to visualize data trends.
- [ ] Integrate AI-driven trend analysis to provide sales performance summaries.
- [ ] Exportable report for business owners.

## Preview
<img src="/public/analytics-dashboard-screenshot.png" width="100%" alt="Dashboard Preview">