import { useMemo, useState } from 'react';
import { categories } from './constants/categories';
import { TabNav } from './components/TabNav';
import { useXpStore } from './hooks/useXpStore';
import DashboardView from './views/DashboardView';
import MonthlyReviewView from './views/MonthlyReviewView';
import BonusQuestsView from './views/BonusQuestsView';
import YearCapsuleView from './views/YearCapsuleView';

const App = () => {
  const store = useXpStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'monthly' | 'quests' | 'capsule'>(
    'dashboard'
  );
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const tabs = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'monthly', label: 'Monthly Review' },
      { key: 'quests', label: 'Bonus Quests' },
      { key: 'capsule', label: 'Year Capsule' },
    ],
    []
  );

  return (
    <div className="app-shell">
      <header>
        <div>
          <p className="text-muted">Life XP Log</p>
          <h1>Life Goals XP Tracker</h1>
        </div>
        <div className="inline-input">
          <label className="small-label" htmlFor="year-select">
            Year
          </label>
          <input
            id="year-select"
            type="number"
            min={2020}
            max={2099}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          />
        </div>
      </header>

      <TabNav tabs={tabs} active={activeTab} onChange={(key) => setActiveTab(key as any)} />

      {activeTab === 'dashboard' && (
        <DashboardView
          year={selectedYear}
          categories={categories}
          monthlyReviews={store.monthlyReviews}
          bonusQuests={store.bonusQuests}
          categoryGoals={store.categoryGoals}
          onGoalChange={store.setCategoryGoal}
        />
      )}

      {activeTab === 'monthly' && (
        <MonthlyReviewView
          year={selectedYear}
          month={selectedMonth}
          categories={categories}
          monthlyReviews={store.monthlyReviews}
          onMonthChange={setSelectedMonth}
          onUpdateReview={store.upsertMonthlyReview}
        />
      )}

      {activeTab === 'quests' && (
        <BonusQuestsView
          categories={categories}
          bonusQuests={store.bonusQuests}
          onAdd={store.addBonusQuest}
          onDelete={store.deleteBonusQuest}
        />
      )}

      {activeTab === 'capsule' && (
        <YearCapsuleView
          categories={categories}
          entries={store.capsuleEntries}
          onAdd={store.addCapsuleEntry}
          onDelete={store.deleteCapsuleEntry}
          year={selectedYear}
        />
      )}
    </div>
  );
};

export default App;
