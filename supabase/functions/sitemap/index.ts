import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Use the request origin or a default
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`.replace('/functions/v1/sitemap', '');
    const siteUrl = baseUrl.includes('supabase') 
      ? 'https://your-domain.com' // Replace with actual domain in production
      : baseUrl;

    // Fetch active categories
    const categoriesResponse = await fetch(`${supabaseUrl}/rest/v1/categories?is_active=eq.true&is_indexed=eq.true&order=sort_order.asc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    const categories = await categoriesResponse.json();

    // Fetch active products
    const productsResponse = await fetch(`${supabaseUrl}/rest/v1/products?is_active=eq.true&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    const products = await productsResponse.json();

    // Generate sitemap XML
    const now = new Date().toISOString();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Catalog -->
  <url>
    <loc>${siteUrl}/catalog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- About -->
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Contact -->
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- FAQ -->
  <url>
    <loc>${siteUrl}/faq</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Add category pages
    if (Array.isArray(categories) && categories.length > 0) {
      xml += `\n  
  <!-- Categories -->`;
      for (const category of categories) {
        const lastmod = category.updated_at || now;
        xml += `
  <url>
    <loc>${siteUrl}/catalog?category=${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }

    // Add product pages
    if (Array.isArray(products) && products.length > 0) {
      xml += `\n  
  <!-- Products -->`;
      for (const product of products) {
        const lastmod = product.updated_at || now;
        xml += `
  <url>
    <loc>${siteUrl}/product/${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }

    xml += `
</urlset>`;

    return new Response(xml, { 
      headers: corsHeaders,
      status: 200 
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      { headers: corsHeaders, status: 200 }
    );
  }
});
