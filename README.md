# Upraze - Momentum of Me

A privacy-first personal analytics app that quantifies your momentum across health, focus, output, learning, and mood.

## 🚀 Features

### Core Functionality
- **Momentum Ribbon**: Visual representation of momentum across 5 life domains
- **Leaderboard**: Sortable view of domains by velocity and performance
- **Task Inbox**: AI-classified task management with momentum tracking
- **Career Board**: Career transition funnel with velocity tracking
- **Weekly Review**: AI-generated insights and next steps

### Momentum Analytics
- **EMA (Exponentially Weighted Moving Average)**: Smooths daily signals
- **Velocity**: Day-to-day momentum changes
- **Acceleration**: Rate of momentum change
- **Phase Detection**: Explore → Ramp → Cruise → Drift → Archive
- **Streak Tracking**: Consistency measurement

### Task Classification
- **Compounding**: Daily habits that build over time
- **Milestone**: One-time goals with clear completion
- **Maintenance**: Ongoing upkeep and standards
- **Cyclical**: Recurring events and planning
- **Exploration**: Research and discovery activities

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (planned)
- **Database**: Supabase (planned)
- **Deployment**: Vercel

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Local-first data storage
- **Responsive Design**: Optimized for mobile and desktop
- **Fast Loading**: Optimized performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MustBeSimo/momentum.git
cd momentum/upraze
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📊 Data Architecture

### Core Entities
- **Users**: User profiles and settings
- **Domains**: Life domain configurations
- **Tasks**: Tracked activities and goals
- **Events**: Raw measurement data
- **Features**: Calculated momentum metrics
- **Phases**: Behavioral stage tracking
- **Forecasts**: Predictive analytics

### Momentum Calculation
```
EMA_t = α*x_t + (1-α)*EMA_{t-1}         # α≈0.3 daily
velocity_t = EMA_t - EMA_{t-1}
accel_t = velocity_t - velocity_{t-1}
streak_t = 1 + (streak_{t-1} if event_today else 0)
streak_score = 1 - exp(-streak_t/7)

Momentum Score = norm(0.5*velocity + 0.2*accel + 0.2*z + 0.1*streak_score)
```

## 🔗 Integrations (Planned)

### Health & Fitness
- **HealthKit** (iOS): Steps, sleep, HRV, active minutes
- **Health Connect** (Android): Health and fitness data
- **Manual Entry**: Custom health metrics

### Focus & Productivity
- **Screen Time** (iOS): App usage and focus metrics
- **Digital Wellbeing** (Android): Screen time and app usage
- **Manual Tracking**: Deep work sessions

### Output & Work
- **GitHub**: Commits, PRs, repositories
- **Todoist**: Task completion and productivity
- **Notion**: Project progress and content creation
- **Manual "Shipped"**: Quick output logging

### Learning
- **Readwise**: Reading progress and highlights
- **Notion**: Notes and learning materials
- **Manual Entry**: Course progress and study time

## 🎯 Roadmap

### MVP (2 weeks) ✅
- [x] Manual events + Mood check-in
- [x] Momentum Ribbon, Leaderboard, Domain Detail
- [x] Weekly Review (LLM), PDF export
- [x] Basic PWA setup

### v1.1 (4–6 weeks)
- [ ] Screen-time Focus connector
- [ ] Todoist connector
- [ ] Phase Detector + Nudge Engine
- [ ] Supabase integration

### v1.2 (8–10 weeks)
- [ ] HealthKit/Health Connect integration
- [ ] Forecasts and predictive analytics
- [ ] Career Board with advanced funnel tracking
- [ ] Advanced AI modules

## 🔒 Privacy & Security

- **Local-first**: Raw data stays on device by default
- **Encryption**: AES-GCM for sensitive data
- **GDPR Compliant**: Data export and deletion
- **Health Disclaimer**: Wellness-only metrics, no medical claims

## 📈 KPIs & Metrics

- **Daily momentum completeness**: ≥80% days with full features
- **Average streak length**: +40% vs baseline
- **Stall detection**: ≥60% detected pre-drift
- **Career funnel velocity**: +25% outreach→interviews

**North-star metric**: % of users with ≥2 domains in **Ramp/Cruise** for 21 consecutive days.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fogg Behavior Model** for nudge design
- **Prophet** for time series forecasting
- **PANAS** for mood measurement
- **HealthKit/Health Connect** for health data integration

---

Built with ❤️ by Simone
