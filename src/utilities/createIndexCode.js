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
  let importBlock;

  importBlock = _.map(files, (fileName) => {
    return (
      'import ' + safeVariableName(fileName) + ' from \'./' + fileName + '\';'
    );
  });

  importBlock = importBlock.join('\n');

  return importBlock;
};

const buildExportBlock = (files) => {
  let exportBlock = '';

  // exportBlock += "export ";
  exportBlock += '{ ';

  exportBlock += _.map(files, (fileName) => {
    return safeVariableName(fileName);
  }).join(', ');

  exportBlock += ' }';

  return 'export ' + exportBlock + ';\n' +
  'export default ' + exportBlock + ';';
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

    code += buildImportBlock(sortedFilePaths);
    code += '\n\n';
    code += buildExportBlock(sortedFilePaths);
    code += '\n\n';
  }

  return code;
};
