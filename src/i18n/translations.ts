export const languages = {
  ru: 'Русский',
  pl: 'Polski',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'ru';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      books: 'Books',
      stories: 'Stories',
      projects: 'Projects',
      contact: 'Contact',
    },
    home: {
      greeting: '',
      title: 'TechnoCastle',
      tagline: 'A quiet corner where words find their shape. Fiction, essays, and experiments in storytelling.',
      latest: 'Latest',
      readMore: 'Read more',
      prevPage: 'Previous',
      nextPage: 'Next',
      pageOf: 'Page {current} of {total}',
      quote: '',
    },
    books: {
      title: 'Books',
      subtitle: 'Long-form works, published and in progress.',
      published: 'Published',
      inProgress: 'In Progress',
      read: 'Read',
      chapters: 'Chapters',
      backToBooks: 'Books',
    },
    stories: {
      title: 'Stories',
      subtitle: 'Short fiction, flash pieces, and experiments in form.',
      translatedBy: 'Translated by'
    },
    projects: {
      title: 'Projects',
      subtitle: 'Experiments, tools, and more.'
    },
    contact: {
      title: 'Contact',
      bio: "<p>I write fiction, take photographs, and code. Over 20 years in the profession.</p><p>Based in Kraków. Originally from Perm.</p><p>In my writing I explore the human soul and its connection to reality. But whatever I write — in the end it's always about love.</p>",
    },
  },

  ru: {
    nav: {
      home: 'Главная',
      books: 'Книги',
      stories: 'Рассказы',
      projects: 'Проекты',
      contact: 'Контакт',
    },
    home: {
      greeting: '',
      title: 'TechnoCastle',
      tagline: 'Тихий уголок, где слова обретают форму. Проза, эссе и эксперименты в повествовании.',
      latest: 'Последнее',
      readMore: 'Читать далее',
      prevPage: 'Назад',
      nextPage: 'Вперёд',
      pageOf: 'Страница {current} из {total}',
      quote: '',
    },
    books: {
      title: 'Книги',
      subtitle: 'Крупная форма — опубликованные и в работе.',
      published: 'Опубликовано',
      inProgress: 'В работе',
      read: 'Читать',
      chapters: 'Главы',
      backToBooks: 'Книги',
    },
    stories: {
      title: 'Рассказы',
      subtitle: 'Короткая проза, миниатюры и эксперименты с формой.',
      translatedBy: 'Перевод:',
    },
    projects: {
      title: 'Проекты',
      subtitle: 'Эксперименты, инструменты и прочее.',
    },
    contact: {
      title: 'Контакт',
      bio: "<p>Пишу фантастику, фотографирую, программирую. Более 20 лет в професиии.</p><p>Живу в Кракове. Родом из Перми.</p><p>В своём творчестве исследую душу человека и её связь с реальностью. Но что бы ни писал — в итоге это всегда про любовь.</p>",
    },
  },

  pl: {
    nav: {
      home: 'Strona główna',
      books: 'Książki',
      stories: 'Opowiadania',
      projects: 'Projekty',
      contact: 'Kontakt',
    },
    home: {
      greeting: '',
      title: 'TechnoCastle',
      tagline: 'Cichy kąt, w którym słowa nabierają kształtu. Proza, eseje i eksperymenty z narracją.',
      latest: 'Najnowsze',
      readMore: 'Czytaj więcej',
      prevPage: 'Wstecz',
      nextPage: 'Dalej',
      pageOf: 'Strona {current} z {total}',
      quote: '',
    },
    books: {
      title: 'Książki',
      subtitle: 'Dłuższe formy — opublikowane i w trakcie pisania.',
      published: 'Opublikowano',
      inProgress: 'W trakcie',
      read: 'Czytaj',
      chapters: 'Rozdziały',
      backToBooks: 'Książki',
    },
    stories: {
      title: 'Opowiadania',
      subtitle: 'Krótka proza, miniatury i eksperymenty z formą.',
      translatedBy: 'Tłumaczenie:',
    },
    projects: {
      title: 'Projekty',
      subtitle: 'Eksperymenty, narzędzia i inne.',
    },
    contact: {
      title: 'Kontakt',
      bio: "<p>Piszę fantastykę, fotografuję, programuję. Ponad 20 lat w zawodzie.</p><p>Mieszkam w Krakowie. Pochodzę z Permu.</p><p>W mojej twórczości badam duszę człowieka i jej związek z rzeczywistością. Ale cokolwiek piszę — ostatecznie zawsze chodzi o miłość.</p>",
    },
  },
} as const;
