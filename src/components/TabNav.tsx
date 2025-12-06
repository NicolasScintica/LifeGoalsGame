import './TabNav.css';

interface TabNavProps {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

export const TabNav = ({ tabs, active, onChange }: TabNavProps) => {
  return (
    <nav className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={tab.key === active ? 'tab active' : 'tab'}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};
