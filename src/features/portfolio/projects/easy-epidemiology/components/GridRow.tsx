interface Props {
  index: number;
}

export function GridRow({ index: i }: Props) {
  const isPatient = i < 40;
  const isConfirmed = isPatient && i % 2 === 0;
  const hasDiarrhea = isPatient && i % 2 === 0;
  const hasVomit = isPatient && i % 3 === 0;
  const hasFever = isPatient && i % 4 === 0;
  const grade = (i % 6) + 1;
  const classNum = (i % 5) + 1;
  const ateSoup = i % 10 !== 0;
  const atePork = i % 3 === 0;
  const ateKimchi = i % 2 === 0;
  const ateRadish = i % 3 !== 0;
  const ateBeanSprout = i % 4 === 0;
  const ateSpinach = i % 5 === 0;
  const ateMilk = i % 2 !== 0;
  const ateYogurt = i % 5 === 0;
  const isSelected = i === 3;
  const onsetDate = `2023-09-${10 + (i % 5)} 10:00`;

  const cell = "border border-gray-300 text-center text-[13px] font-medium text-slate-700";
  const flag = (v: boolean) => v ? "1" : "0";

  return (
    <tr className="h-[35px]">
      <td className="border border-gray-300 bg-slate-100 text-center text-[12px] text-slate-500 font-medium">{i + 1}</td>
      <td className={cell}>{flag(isPatient)}</td>
      <td className={cell}>{flag(isConfirmed)}</td>
      <td className="border border-gray-300 text-center text-[13px] text-slate-700 relative">
        {grade}
        {isSelected && <div className="absolute inset-0 border-[2px] border-[#1a73e8] pointer-events-none z-10" />}
      </td>
      <td className="border border-gray-300 text-center text-[13px] text-slate-700">{classNum}</td>
      <td className={cell}>{flag(hasDiarrhea)}</td>
      <td className={cell}>{flag(hasVomit)}</td>
      <td className={cell}>{flag(hasFever)}</td>
      <td className="border border-gray-300 text-center text-[12px] text-slate-600 font-mono tracking-tight">
        {isPatient ? onsetDate : ""}
      </td>
      <td className={cell}>1</td>
      <td className={cell}>{flag(ateSoup)}</td>
      <td className={cell}>{flag(atePork)}</td>
      <td className={cell}>{flag(ateKimchi)}</td>
      <td className={cell}>{flag(ateRadish)}</td>
      <td className={cell}>{flag(ateBeanSprout)}</td>
      <td className={cell}>{flag(ateSpinach)}</td>
      <td className={cell}>{flag(ateMilk)}</td>
      <td className={cell}>{flag(ateYogurt)}</td>
      <td className="border border-gray-300" />
    </tr>
  );
}
