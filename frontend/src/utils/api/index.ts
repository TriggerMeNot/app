import playgrounds from "./playgrounds";

export const {
  getAllPlaygrounds,
  createPlayground,
  getPlaygroundById,
  addActionToPlayground,
  addReactionToPlayground,
  deleteActionFromPlayground,
  deleteReactionFromPlayground,
  deletePlayground,
  addActionToReactionLink,
  addReactionToReactionLink,
  deleteLink,
  editReaction
} = playgrounds;
