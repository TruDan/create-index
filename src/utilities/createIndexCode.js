import _ from 'lodash';

const safeVariableName = (fileName) => {
  const indexOfDot = fileName.indexOf('.');

  if (indexOfDot === -1) {
    return fileName;
  } else {
    return fileName.slice(0, indexOfDot);
  }
};

const buildImportBlock = (files) => {
  return _.map(files, (fileName) => {
    return `import ${safeVariableName(fileName)} from './${fileName}';`;
  }).join('\n');
};

const buildExportBlock = (files) => {
  const exportBlock = '{ ' + _.map(files, (fileName) => {
    return safeVariableName(fileName);
  }).join(', ') + ' }';

  return 'export ' + exportBlock + ';\n' +
  'export default ' + exportBlock + ';';
};

const buildFlattenedBlock = (files) => {
  return _.map(files, (fileName) => {
    return `export * from './${fileName}';`;
  }).join('\n');
};

export default (filePaths, options = {}) => {
  let code;
  let configCode;

  code = '';
  configCode = '';

  if (options.banner) {
    const banners = _.isArray(options.banner) ?
      options.banner :
      [options.banner];

    banners.forEach((banner) => {
      code += banner + '\n';
    });

    code += '\n';
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += ' ' + JSON.stringify(options.config);
  }

  code += '// @create-index' + configCode + '\n\n';

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();
    if (options.config && options.config.flatten) {
      code += buildFlattenedBlock(sortedFilePaths);
    } else {
      code += buildImportBlock(sortedFilePaths);
      code += '\n\n';
      code += buildExportBlock(sortedFilePaths);
    }
    code += '\n\n';
  }

  return code;
};
