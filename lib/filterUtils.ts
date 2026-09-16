export function extractFilterGroups(rawProducts: any[]) {
  const dynamicBrandsMap = new Map();
  const dynamicSpecsMap = new Map();

  rawProducts.forEach((p: any) => {
    // brands
    if (p && p.brand) {
      const brandId = p.brand.slug || p.brand.id;
      if (brandId !== undefined && brandId !== null) {
        dynamicBrandsMap.set(brandId, {
          label: p.brand.name || String(brandId),
          value: brandId.toString(),
        });
      }
    }

    // specs
    if (Array.isArray(p.specifications)) {
      p.specifications.forEach((spec: any) => {
        const featureTitle = spec.feature?.title;
        if (featureTitle && spec.value) {
          if (!dynamicSpecsMap.has(featureTitle)) {
            dynamicSpecsMap.set(featureTitle, {
              id: featureTitle.toLowerCase().replace(/\s+/g, "_"),
              title: featureTitle,
              valuesSet: new Set(),
            });
          }
          dynamicSpecsMap.get(featureTitle).valuesSet.add(spec.value);
        }
      });
    }
  });

  const filterGroups: any[] = [];

  // add brands or specs
  if (dynamicBrandsMap.size > 0) {
    filterGroups.push({
      id: "brand",
      title: "برند",
      options: Array.from(dynamicBrandsMap.values()),
    });
  }

  dynamicSpecsMap.forEach((group) => {
    filterGroups.push({
      id: group.id,
      title: group.title,
      options: Array.from(group.valuesSet).map((val: any) => ({
        label: val,
        value: val,
      })),
    });
  });

  return filterGroups;
}