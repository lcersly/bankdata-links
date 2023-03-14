export const PATHS_URLS = {
  links: 'links',
  createLink: 'links/create',
  tags: 'tags',
  createTag: 'tags/create',
  login: 'login'
} as const;

export const ROOT_PATHS_URLS = {
  links: '/' + PATHS_URLS.links,
  createLink: '/' + PATHS_URLS.createLink,
  tags: '/' + PATHS_URLS.tags,
  createTag: '/' + PATHS_URLS.createTag,
  login: '/' + PATHS_URLS.login
} as const
