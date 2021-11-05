import {
  Encoding,
  OCABuilder,
  AttributeBuilder,
  AttributeType,
  Entry
} from 'oca.js'

export const createOCA = () => {
  return new OCABuilder(Encoding.Utf8)
    .addName({
      en_EN: 'Driving Licence',
      pl_PL: 'Prawo Jazdy'
    })
    .addDescription({
      en_EN: 'OCA for driving licence',
      pl_PL: 'OCA dla prawa jazdy'
    })
    .addAttribute(
      new AttributeBuilder('name', AttributeType.Text)
        .setPii()
        .addLabel({
          en_EN: 'Name: ',
          pl_PL: 'Imię: '
        })
        .addInformation({
          en_EN: 'Provide your name',
          pl_PL: 'Wprowadź swoje imię'
        })
        .build()
    )
    .addAttribute(
      new AttributeBuilder('gender', AttributeType.Text)
        .addEncoding(Encoding.Iso8859_1)
        .addLabel({
          en_EN: 'Gender: ',
          pl_PL: 'Płeć: '
        })
        .addEntries([
          new Entry('m', {
            en_EN: 'Male',
            pl_PL: 'Mężczyzna'
          }).plain(),
          new Entry('f', {
            en_EN: 'Female',
            pl_PL: 'Kobieta'
          }).plain()
        ])
        .build()
    )
    .addAttribute(
      new AttributeBuilder('birth_date', AttributeType.Date)
        .setPii()
        .addLabel({
          en_EN: 'Birth date: ',
          pl_PL: 'Data urodzin: '
        })
        .addFormat('DD-MM-YYYY')
        .build()
    )
    .addAttribute(
      new AttributeBuilder('age', AttributeType.Number)
        .addLabel({
          en_EN: 'Age: ',
          pl_PL: 'Wiek: '
        })
        .addUnit('years')
        .build()
    )
    .addAttribute(
      new AttributeBuilder('categories', AttributeType.ArrayText)
        .addLabel({
          en_EN: 'Categories: ',
          pl_PL: 'Kategorie: '
        })
        .addInformation({
          en_EN: 'Select licence categories',
          pl_PL: 'Wybierz kategorie uprawnień'
        })
        .addEntries([
          new Entry('a1', {
            en_EN: 'A1',
            pl_PL: 'A1'
          }).plain(),
          new Entry('a2', {
            en_EN: 'A2',
            pl_PL: 'A2'
          }).plain(),
          new Entry('b1', {
            en_EN: 'B1',
            pl_PL: 'B1'
          }).plain(),
          new Entry('b2', {
            en_EN: 'B2',
            pl_PL: 'B2'
          }).plain()
        ])
        .build()
    )
    .addAttribute(
      new AttributeBuilder('consent', AttributeType.Boolean)
        .addLabel({
          en_EN: 'Consent: ',
          pl_PL: 'Zgoda: '
        })
        .build()
    )
    .finalize()
}
