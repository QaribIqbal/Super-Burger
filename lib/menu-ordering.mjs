export function getRequiredGroups(item) {
  return (item.modifierGroups ?? []).filter((group) => group.required && group.minSelections > 0);
}

export function getMenuOrderAction(item) {
  if (item.availability === "unavailable") return "unavailable";
  return getRequiredGroups(item).length > 0 ? "choose-options" : "add";
}

export function getStandardModifiers(item) {
  return (item.modifierGroups ?? []).flatMap((group) => {
    const defaultOption = group.options.find((option) => option.defaultSelected);
    return defaultOption ? [{ groupId: group.id, optionId: defaultOption.id }] : [];
  });
}
