import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'date',
      validation: r => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Korte beschrijving',
      type: 'text',
      rows: 3,
      description: 'Wordt getoond op de kaart op de homepage.',
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: [
          { title: 'Verhalen', value: 'Verhalen' },
          { title: 'Gedichten', value: 'Gedichten' },
          { title: 'Kattenbellen', value: 'Kattenbellen' },
        ],
        layout: 'radio',
      },
      validation: r => r.required(),
    }),
    defineField({
      name: 'color',
      title: 'Kaartkleur',
      type: 'string',
      options: {
        list: [
          { title: '🌸 Roze',       value: '#FAD5DA' },
          { title: '🩵 Turquoise',  value: '#BEE9E9' },
          { title: '💜 Lavendel',   value: '#E2D4F0' },
          { title: '🍑 Perzik',     value: '#FAE5CE' },
          { title: '🌿 Mintgroen',  value: '#C8EAD8' },
          { title: '🔵 Lichtblauw', value: '#DDD0F0' },
        ],
      },
      initialValue: '#FAD5DA',
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      initialValue: '✍️',
    }),
    defineField({
      name: 'content',
      title: 'Inhoud',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normaal',  value: 'normal' },
            { title: 'Kop',      value: 'h2' },
            { title: 'Citaat',   value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Vet',     value: 'strong' },
              { title: 'Cursief', value: 'em' },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
  orderings: [
    { title: 'Datum (nieuwste eerst)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
})
