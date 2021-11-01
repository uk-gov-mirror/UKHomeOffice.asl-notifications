module.exports = ({ model, licenceType, applicant }) => {

  switch (licenceType) {
    case 'profile':
    case 'pil':
    case 'trainingPil':
      return `${applicant.firstName} ${applicant.lastName}`;

    case 'pel':
      return model && model.name;

    case 'ppl':
      return model && model.title;
  }
  return '';
};
