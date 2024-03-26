/**
 *
 * Only the root AppModule should import the CoreModule.
 * This function is used to prevent re-import of the core module.
 * Please see Angular style guide recommendation STYLE 04-12.
 * https://angular.io/docs/ts/latest/guide/style-guide.html#!#application-structure-and-angular-modules
 *
 */

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}
