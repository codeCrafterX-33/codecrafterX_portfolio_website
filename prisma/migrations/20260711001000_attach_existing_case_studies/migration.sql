UPDATE "Project"
SET
  "casestudy" = true,
  "casestudytitle" = 'Complete WordPress E-commerce Build',
  "casestudycompany" = 'Crismyla International',
  "results" =
    CASE
      WHEN '60% increase in online sales' = ANY("results") THEN "results"
      ELSE ARRAY[
        '60% increase in online sales',
        'Established strong brand presence in beauty industry',
        'Automated order management and customer support'
      ] || "results"
    END,
  "techstack" = "techstack"
    || CASE
      WHEN 'Mailchimp' = ANY("techstack") THEN ARRAY[]::TEXT[]
      ELSE ARRAY['Mailchimp']
    END
    || CASE
      WHEN 'Google Analytics' = ANY("techstack") THEN ARRAY[]::TEXT[]
      ELSE ARRAY['Google Analytics']
    END,
  "updatedat" = CURRENT_TIMESTAMP
WHERE "slug" = 'crismyla';

INSERT INTO "Project" (
  "id",
  "slug",
  "title",
  "category",
  "description",
  "longdescription",
  "challenge",
  "solution",
  "results",
  "techstack",
  "images",
  "liveurl",
  "features",
  "bgcolor",
  "featured",
  "casestudy",
  "casestudytitle",
  "casestudycompany",
  "published",
  "sortorder",
  "createdat",
  "updatedat"
) VALUES (
  'seed_toke_makinwa_beauty',
  'toke-makinwa-beauty',
  'Toke Makinwa Beauty',
  'E-commerce Management',
  'Management and optimization of international Shopify and Nigeria WordPress e-commerce platforms.',
  'Managed and optimized Toke Makinwa Beauty across its international Shopify store and Nigeria WordPress store, improving performance and creating a more consistent shopping experience across both platforms.',
  'Managing two separate e-commerce platforms - international Shopify site and Nigeria WordPress site - requiring optimization and seamless user experience',
  'WordPress site optimization, performance improvements, and strategic management of dual-platform operations as Website Manager',
  ARRAY[
    '40% increase in online sales through collaborative efforts',
    'Optimized Nigeria WordPress site (tokemakinwabeauty.com.ng) performance',
    'Improved user experience across both platforms'
  ],
  ARRAY['WordPress', 'PHP', 'WooCommerce', 'Shopify', 'Multi-Platform Management', 'Performance Optimization'],
  ARRAY['/images/tokemakinwa_logo.jpg'],
  'https://tokemakinwabeauty.com/',
  ARRAY[
    'Dual-platform e-commerce management',
    'WordPress performance optimization',
    'Shopify store management',
    'Customer experience improvements'
  ],
  'bg-[#ecfdf3]',
  false,
  true,
  'Multi-Platform E-commerce Management',
  'Toke Makinwa Beauty',
  true,
  3,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "casestudy" = EXCLUDED."casestudy",
  "casestudytitle" = EXCLUDED."casestudytitle",
  "casestudycompany" = EXCLUDED."casestudycompany",
  "challenge" = EXCLUDED."challenge",
  "solution" = EXCLUDED."solution",
  "results" = EXCLUDED."results",
  "techstack" = EXCLUDED."techstack",
  "updatedat" = CURRENT_TIMESTAMP;
