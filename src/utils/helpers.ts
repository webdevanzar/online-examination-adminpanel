// =================== DEBOUNCE ===================
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// =================== GET INITIALS ===================
export function getInitials(name: string): string {
  if (!name) return "NA";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// =================== FORMAT RELATIVE DATE ===================
export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const diffInMs = targetDate.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  // Past dates
  if (diffInMs < 0) {
    const absDays = Math.abs(diffInDays);
    const absHours = Math.abs(diffInHours);
    const absMinutes = Math.abs(diffInMinutes);

    if (absDays > 30) {
      const months = Math.floor(absDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
    if (absDays > 0) {
      return `${absDays} day${absDays > 1 ? "s" : ""} ago`;
    }
    if (absHours > 0) {
      return `${absHours} hour${absHours > 1 ? "s" : ""} ago`;
    }
    if (absMinutes > 0) {
      return `${absMinutes} minute${absMinutes > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  }

  // Future dates
  if (diffInDays > 30) {
    const months = Math.floor(diffInDays / 30);
    return `In ${months} month${months > 1 ? "s" : ""}`;
  }
  if (diffInDays > 0) {
    return `In ${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
  }
  if (diffInHours > 0) {
    return `In ${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
  }
  if (diffInMinutes > 0) {
    return `In ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  }
  return "Now";
}

// =================== FORMAT DATE ===================
export function formatDate(date: Date | string): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  return targetDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// =================== FORMAT DATE TIME ===================
export function formatDateTime(date: Date | string): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  return targetDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// =================== FORMAT SCORE ===================
export function formatScore(score: number, total: number): string {
  const percentage = (score / total) * 100;
  return `${score}/${total} (${percentage.toFixed(1)}%)`;
}

// =================== GET SCORE COLOR ===================
export function getScoreColor(score: number, passingScore: number): string {
  if (score >= passingScore) {
    return "text-green-600";
  }
  return "text-red-600";
}

// =================== GET STATUS BADGE COLOR ===================
export function getStatusBadgeColor(status: string): string {
  const statusLower = status.toLowerCase();

  if (statusLower === "pass" || statusLower === "active" || statusLower === "published") {
    return "bg-green-100 text-green-800";
  }
  if (statusLower === "fail" || statusLower === "inactive") {
    return "bg-red-100 text-red-800";
  }
  if (statusLower === "draft" || statusLower === "pending") {
    return "bg-yellow-100 text-yellow-800";
  }
  return "bg-blue-100 text-blue-800";
}

// =================== SORT BY FIELD ===================
export function sortByField<T>(
  data: T[],
  field: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === "asc"
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }

    return 0;
  });
}

// =================== FILTER BY DATE RANGE ===================
export function filterByDateRange<T>(
  data: T[],
  dateField: keyof T,
  startDate?: Date | string,
  endDate?: Date | string
): T[] {
  if (!startDate && !endDate) return data;

  return data.filter((item) => {
    const itemDate = item[dateField];
    if (!itemDate) return false;

    const date = typeof itemDate === "string" ? new Date(itemDate) : itemDate as Date;

    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate)) return false;

    return true;
  });
}

// =================== TRUNCATE TEXT ===================
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
