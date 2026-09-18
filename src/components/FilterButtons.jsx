const filters = [['all', 'All'], ['active', 'Active'], ['completed', 'Done']]

export default function FilterButtons({ value, onChange }) {
  return <div className="filter-buttons" role="group" aria-label="Filter tasks">
    {filters.map(([key, label]) => <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)}>{label}</button>)}
  </div>
}
