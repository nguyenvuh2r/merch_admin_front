// Interface unified integration module
import * as auth from './modules/auth'
import * as user from './modules/website/user'

import * as blogCategory from './modules/blog/category'
import * as blogPost from './modules/blog/post'

import * as rolePermission from './modules/website/rolePermission'

// Export all by default
export default {
    auth,
    user,
    blogCategory,
    blogPost,
    rolePermission,
}
