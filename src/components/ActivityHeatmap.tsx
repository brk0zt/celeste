import { useMemo } from "react";

interface ActivityData {
  date: string;
  count: number;
  level: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  days?: number;
}

export function ActivityHeatmap({ data, days = 365 }: ActivityHeatmapProps) {
  const weeks = useMemo(() => {
    const result: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];
    
    // Fill in any missing dates at the beginning to align weeks
    const firstDate = new Date(data[0]?.date || new Date());
    const startDay = firstDate.getDay();
    
    for (let i = 0; i < startDay; i++) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
    
    data.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", count: 0, level: 0 });
      }
      result.push(currentWeek);
    }
    
    return result;
  }, [data]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-[#161b22]";
      case 1:
        return "bg-[#0e4429]";
      case 2:
        return "bg-[#006d32]";
      case 3:
        return "bg-[#26a641]";
      case 4:
        return "bg-[#39d353]";
      default:
        return "bg-[#161b22]";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const monthLabels = useMemo(() => {
    const labels: Array<{ index: number; label: string }> = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      week.forEach((day) => {
        if (day.date) {
          const date = new Date(day.date);
          const month = date.getMonth();
          if (month !== lastMonth) {
            labels.push({
              index: weekIndex,
              label: date.toLocaleDateString("tr-TR", { month: "short" }),
            });
            lastMonth = month;
          }
        }
      });
    });
    
    return labels;
  }, [weeks]);

  if (!data.length) {
    return (
      <div className="text-sm text-[#666]">
        Henüz aktivite kaydı bulunmuyor.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[750px]">
        {/* Month labels */}
        <div className="flex mb-2">
          <div className="w-8" /> {/* Spacer for day labels */}
          <div className="flex-1 flex relative h-4">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="absolute text-xs text-[#666]"
                style={{ left: `${(label.index / weeks.length) * 100}%` }}
              >
                {label.label}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between w-8 mr-2 text-xs text-[#666]">
            <span>Pzt</span>
            <span>Sal</span>
            <span>Çar</span>
            <span>Per</span>
            <span>Cum</span>
            <span>Cmt</span>
            <span>Paz</span>
          </div>

          {/* Weeks */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`
                      w-[10px] h-[10px] rounded-sm ${getLevelColor(day.level)}
                      transition-all duration-200 hover:ring-2 hover:ring-[#d4a574]
                      cursor-pointer
                    `}
                    title={
                      day.date
                        ? `${formatDate(day.date)}: ${day.count} aktivite`
                        : ""
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end mt-4 gap-2 text-xs text-[#666]">
          <span>Az</span>
          <div className="flex gap-[3px]">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-[10px] h-[10px] rounded-sm ${getLevelColor(level)}`}
              />
            ))}
          </div>
          <span>Çok</span>
        </div>
      </div>
    </div>
  );
}
