"use client";

export function LocalDate({ currentDate }: { readonly currentDate: Date }) {
  return (
    <div>
      {currentDate.getUTCFullYear()}-{currentDate.getMonth() + 1}-
      {currentDate.getDate()} {currentDate.getHours()}:
      {currentDate.getMinutes()}:{currentDate.getSeconds()}.
      {currentDate.getMilliseconds()}
    </div>
  );
}
