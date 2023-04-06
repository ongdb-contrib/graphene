import PROPERTY_TYPES from '../../enums/PROPERTY_TYPES';

const TextTypes = [PROPERTY_TYPES.STRING, PROPERTY_TYPES.URL, PROPERTY_TYPES.EMAIL, PROPERTY_TYPES.PASSWORD];

/**
 * @param {object} property
 * @returns {string}
 * @private
 */
const getPropertySpec = (property) => {
  const suffix = TextTypes.indexOf(property.type) !== -1 ? ' length' : '';
  let propertyDescription = `#${property.description}`;

  if (property.defaultValue) {
    propertyDescription += `; default: ${property.defaultValue}`;
  }

  if (property.limitMin) {
    propertyDescription += `; min${suffix}: ${property.limitMin}`;
  }

  if (property.limitMax) {
    propertyDescription += `; max${suffix}: ${property.limitMax}`;
  }

  return `
${propertyDescription}
${property.key}: ${property.type}${property.isRequired ? '!' : ''}
`;
};

export default getPropertySpec
