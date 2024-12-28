export const handleDateFormat = (date: string | null) => {
  if (date == null || date == "") {
    return null;
  }
  console.log(new Date(date).toISOString());
  return new Date(date).toISOString();
};
