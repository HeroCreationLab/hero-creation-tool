export type IndexEntry = {
  _id: string;
  _pack: string;
  _uuid: string;
  type: string;
  name: string;
  img: string;
  local?: Item; // for cases where we take the item from the directory instead of from a compendium index
};
