const content = `
const getActualDeliveryDate = (projectId: string) => {
  const delivery = packagingDeliveries.find(d => d.projectId === projectId);
  return delivery?.deliveryDate;
};
`;
console.log(content);
