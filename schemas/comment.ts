import { defineField, defineType } from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Reacties',
  type: 'document',
  fields: [
    defineField({
      name: 'postSlug',
      title: 'Post',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Reactie',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'approved',
      title: 'Goedgekeurd',
      type: 'boolean',
      initialValue: false,
      description: 'Zet aan om de reactie zichtbaar te maken op de website.',
    }),
    defineField({
      name: 'createdAt',
      title: 'Datum',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'message',
      approved: 'approved',
    },
    prepare({ title, subtitle, approved }: { title: string; subtitle: string; approved: boolean }) {
      return {
        title: `${approved ? '✅' : '⏳'} ${title ?? '—'}`,
        subtitle: subtitle?.slice(0, 80),
      }
    },
  },
  orderings: [
    {
      title: 'Nieuwste eerst',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' as const }],
    },
  ],
})
