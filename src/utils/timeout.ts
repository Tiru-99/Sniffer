// function for handling timeout and clearing timeout if the process is a success 
export const withTimeout  = async<T> (
  promise: Promise<T>,
  duration: number,
  message: string,
): Promise<T> => {
  let timer;
  try {
    const timerPromise = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(message));
      }, duration);
    });
    const result = await Promise.race([promise, timerPromise]) as T;
    return result;
  } finally {
    clearTimeout(timer);
  }
};
