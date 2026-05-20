import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/plugins/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name:      'marie-boddaert-blog',
  title:     'Marie H. Boddaert — Blog',
  projectId: 'xfgj8bxt',
  dataset:   'production',
  basePath:  '/studio',
  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Inhoud')
          .items([
            S.listItem().title('Verhalen').child(
              S.documentList().title('Verhalen').filter('_type == "post" && category == "Verhalen"')
            ),
            S.listItem().title('Gedichten').child(
              S.documentList().title('Gedichten').filter('_type == "post" && category == "Gedichten"')
            ),
            S.listItem().title('Kattenbellen').child(
              S.documentList().title('Kattenbellen').filter('_type == "post" && category == "Kattenbellen"')
            ),
            S.divider(),
            S.listItem().title('Alle posts').child(
              S.documentList().title('Alle posts').filter('_type == "post"')
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2025-01-01' }),
  ],
  schema: { types: schemaTypes },
})
