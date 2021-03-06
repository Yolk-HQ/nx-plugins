import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runCommandAsync,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('nx-next e2e', () => {
  it('should create nx-next', async (done) => {
    const plugin = uniq('nx-next');
    ensureNxProject('@yolkai/nx-next', 'dist/libs/nx-next');
    await runCommandAsync('npm install');
    await runNxCommandAsync(`generate @yolkai/nx-next:example ${plugin}`);

    const result = await runNxCommandAsync(`example ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  }, 20000);

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-next');
      ensureNxProject('@yolkai/nx-next', 'dist/libs/nx-next');
      await runCommandAsync('npm install');
      await runNxCommandAsync(`generate @yolkai/nx-next:example ${plugin} --directory subdir`);
      expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow();
      done();
    }, 20000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-next');
      ensureNxProject('@yolkai/nx-next', 'dist/libs/nx-next');
      await runCommandAsync('npm install');
      await runNxCommandAsync(
        `generate @yolkai/nx-next:example ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    }, 20000);
  });
});
