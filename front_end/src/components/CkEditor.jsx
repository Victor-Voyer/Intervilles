import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default function CkEditor({ value = '', onChange, placeholder = '' }) {
  return (
    <div className="rich-text-editor">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          placeholder,
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'undo',
            'redo'
          ],
          removePlugins: ['FontColor', 'FontBackgroundColor'],
        }}
        onChange={(_, editor) => {
          const data = editor.getData()
          if (onChange) {
            onChange(data)
          }
        }}
      />
    </div>
  )
}

