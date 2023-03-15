export const PATHS_URLS = {
  links: 'links',
  createLink: 'links/create',
  tags: 'tags',
  createTag: 'tags/create',
  help: 'hints',
  login: 'login'
} as const;

export const FULL_PATHS_URLS = {
  links: '/' + PATHS_URLS.links,
  createLink: '/' + PATHS_URLS.createLink,
  tags: '/' + PATHS_URLS.tags,
  createTag: '/' + PATHS_URLS.createTag,
  help: '/' + PATHS_URLS.help,
  login: '/' + PATHS_URLS.login
} as const
