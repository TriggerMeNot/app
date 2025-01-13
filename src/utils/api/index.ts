import playgrounds from "./playgrounds";
import services from "./services";

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
  editReaction,
  editAction
} = playgrounds;

export const {
  getServiceGithubAuth,
  sendServiceGithubAuth
} = services;
