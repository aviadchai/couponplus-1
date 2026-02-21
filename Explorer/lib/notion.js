import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getCoupons() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DB_ID,
    filter: {
      property: 'סטטוס',
      select: {
        equals: 'פעיל',
      },
    },
    sorts: [
      {
        property: 'תאריך פקיעה',
        direction: 'ascending',
      },
    ],
  });

  return response.results.map((page) => {
    const props = page.properties;
    return {
      id: page.id,
      name: props['Name']?.title?.[0]?.plain_text || '',
      code: props['קוד']?.rich_text?.[0]?.plain_text || '',
      discount: props['הנחה']?.rich_text?.[0]?.plain_text || '',
      chain: props['רשת']?.select?.name || '',
      category: props['קטגוריה']?.select?.name || '',
      status: props['סטטוס']?.select?.name || '',
      expiry: props['תאריך פקיעה']?.date?.start || '',
      badge: props['Badge']?.select?.name || '',
      image: props['תמונה']?.files?.[0]?.file?.url || props['תמונה']?.files?.[0]?.external?.url || '',
    };
  });
}
