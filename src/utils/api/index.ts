import playgrounds from "./playgrounds";
import services from "./services";
import auth from "./auth";

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
  editAction,
  editPlayground
} = playgrounds;

export const {
  getServiceGithubAuth,
  sendServiceGithubAuth,
  getServiceGoogleAuth,
  sendServiceGoogleAuth,
  getServiceDiscordAuth,
  sendServiceDiscordAuth,
  getServiceMicrosoftAuth,
  sendServiceMicrosoftAuth,
  getServiceServiceAuth,
  sendServiceServiceAuth,
} = services;

export const {
  forgotPassword,
  resetPassword,
} = auth;
