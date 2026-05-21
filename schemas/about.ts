import { defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'Over mij pagina',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      title: 'Profielfoto',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload een nieuwe profielfoto.',
    }),
    defineField({
      name: 'tagline',
      title: 'Paginatitel',
      type: 'string',
      initialValue: 'Marie H. Boddaert schrijft.',
      description: 'De grote kop bovenaan de pagina.',
    }),
    defineField({
      name: 'services',
      title: 'Wat schrijft Marie?',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'De lijst met schrijfstijlen (bijv. Blogs, Gedichten, Kattenbellen…)',
    }),
    defineField({
      name: 'bio',
      title: 'Biografie',
      type: 'array',
      of: [{
        type: 'block',
        styles: [{ title: 'Normaal', value: 'normal' }],
        marks: { decorators: [
          { title: 'Vet', value: 'strong' },
          { title: 'Cursief', value: 'em' },
        ]},
      }],
      description: 'De persoonlijke tekst. Elke Enter = nieuwe alinea.',
    }),
    defineField({
      name: 'slogan',
      title: 'Slotcitaat',
      type: 'string',
      initialValue: 'Gelukkig kan ze nog wel schrijven.',
    }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'linkedin',  title: 'LinkedIn URL',  type: 'url' }),
    defineField({ name: 'blogger',   title: 'Blogger URL',   type: 'url' }),
    defineField({ name: 'substack',  title: 'Substack URL',  type: 'url' }),
  ],
  preview: {
    prepare: () => ({ title: 'Over mij' }),
  },
})
