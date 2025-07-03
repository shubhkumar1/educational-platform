import { ListItem } from '@tiptap/extension-list-item'
import { Node } from '@tiptap/core'

export const CustomListItem = ListItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      liststyletype: {
        default: null,
        parseHTML: element => element.style.listStyleType,
        renderHTML: attributes => {
          if (!attributes.liststyletype) {
            return {}
          }
          return {
            'style': `list-style-type: ${attributes.liststyletype}`,
          }
        },
      },
    }
  },
})

export default CustomListItem