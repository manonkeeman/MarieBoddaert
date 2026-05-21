import { defineConfig, defineField, defineType } from 'sanity'
import { structureTool } from 'sanity/structure'

const post = defineType({
  name: 'post', title: 'Post', type: 'document',
  fields: [
    defineField({ name: 'title',   title: 'Titel',             type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug',    title: 'Slug (URL)',         type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'date',    title: 'Datum',              type: 'date', validation: r => r.required() }),
    defineField({ name: 'excerpt', title: 'Korte beschrijving', type: 'text', rows: 3 }),
    defineField({ name: 'category', title: 'Categorie', type: 'string',
      options: { list: ['Verhalen','Gedichten','Kattenbellen'].map(v => ({ title: v, value: v })), layout: 'radio' },
      validation: r => r.required() }),
    defineField({ name: 'color', title: 'Kaartkleur', type: 'string', initialValue: '#FAD5DA',
      options: { list: [
        { title: '🌸 Roze', value: '#FAD5DA' }, { title: '🩵 Turquoise', value: '#BEE9E9' },
        { title: '💜 Lavendel', value: '#E2D4F0' }, { title: '🍑 Perzik', value: '#FAE5CE' },
        { title: '🌿 Mintgroen', value: '#C8EAD8' },
      ]}},),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string', initialValue: '✍️' }),
    defineField({ name: 'content', title: 'Inhoud', type: 'array', of: [{
      type: 'block',
      styles: [{ title: 'Normaal', value: 'normal' }, { title: 'Kop', value: 'h2' }, { title: 'Citaat', value: 'blockquote' }],
      marks: { decorators: [{ title: 'Vet', value: 'strong' }, { title: 'Cursief', value: 'em' }] },
    }]}),
  ],
  preview: { select: { title: 'title', subtitle: 'date' } },
})

const about = defineType({
  name: 'about', title: 'Over mij pagina', type: 'document',
  fields: [
    defineField({ name: 'photo',   title: 'Profielfoto',   type: 'image', options: { hotspot: true } }),
    defineField({ name: 'tagline', title: 'Paginatitel',   type: 'string', initialValue: 'Marie H. Boddaert schrijft.' }),
    defineField({ name: 'services', title: 'Schrijfstijlen', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'bio', title: 'Biografie', type: 'array', of: [{
      type: 'block',
      styles: [{ title: 'Normaal', value: 'normal' }],
      marks: { decorators: [{ title: 'Vet', value: 'strong' }, { title: 'Cursief', value: 'em' }] },
    }]}),
    defineField({ name: 'slogan',    title: 'Slotcitaat',   type: 'string', initialValue: 'Gelukkig kan ze nog wel schrijven.' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'linkedin',  title: 'LinkedIn URL',  type: 'url' }),
    defineField({ name: 'blogger',   title: 'Blogger URL',   type: 'url' }),
    defineField({ name: 'substack',  title: 'Substack URL',  type: 'url' }),
  ],
  preview: { prepare: () => ({ title: 'Over mij' }) },
})

export default defineConfig({
  name: 'marie-boddaert-blog', title: 'Marie H. Boddaert — Blog',
  projectId: 'xfgj8bxt', dataset: 'production', basePath: '/',
  plugins: [
    structureTool({
      structure: S => S.list().title('Inhoud').items([
        S.listItem().title('📝 Verhalen').child(S.documentList().title('Verhalen').filter('_type == "post" && category == "Verhalen"')),
        S.listItem().title('📝 Gedichten').child(S.documentList().title('Gedichten').filter('_type == "post" && category == "Gedichten"')),
        S.listItem().title('📝 Kattenbellen').child(S.documentList().title('Kattenbellen').filter('_type == "post" && category == "Kattenbellen"')),
        S.divider(),
        S.listItem().title('📝 Alle posts').child(S.documentList().title('Alle posts').filter('_type == "post"')),
        S.divider(),
        S.listItem().title('👤 Over mij pagina').child(
          S.editor().schemaType('about').documentId('about-page').title('Over mij')
        ),
      ]),
    }),
  ],
  schema: { types: [post, about] },
})
