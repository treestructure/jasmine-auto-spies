import { ReplaySubject } from 'rxjs';
import {
  SpyFunctionReturnValueContainer,
  CalledWithObject
} from '../create-spy-from-class.types';

export function observablifySpyFunction(
  spyFunction: any,
  valueContainer: SpyFunctionReturnValueContainer
) {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  spyFunction.and.nextWith = function nextWith(value: any) {
    valueContainer.value = subject;
    subject.next(value);
  };

  spyFunction.and.nextOneTimeWith = function nextOneTimeWith(value: any) {
    valueContainer.value = subject;
    subject.next(value);
    subject.complete();
  };

  spyFunction.and.throwWith = function throwWith(value: any) {
    valueContainer.value = subject;
    subject.error(value);
  };

  spyFunction.and.complete = function complete() {
    valueContainer.value = subject;
    subject.complete();
  };
}

export function addObservableHandlingToCalledWith(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
) {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  calledWithObject.nextWith = function(value: any) {
    subject.next(value);
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.nextOneTimeWith = function(value: any) {
    subject.next(value);
    subject.complete();
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.throwWith = function(value: any) {
    subject.error(value);
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.complete = function() {
    subject.complete();
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  return calledWithObject;
}
