export default function SidebarWidget() {
  return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                      Support
                  </h4>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7 2xl:gap-x-32">
                      <div>
                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                              Name
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                              Joseph Ho
                          </p>
                      </div>

                      <div>
                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                              Email address
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                              joe@mail.com
                          </p>
                      </div>

                      <div>
                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                              Phone
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                              +61 406 363 212
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
