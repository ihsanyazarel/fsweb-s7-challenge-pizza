import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";


function OrderPizza() {
  const [checkedExtras, setCheckedExtras] = useState([]);
  const [numberOfPizzas, setNumberOfPizzas] = useState(1);
  const extras = ["Pepperoni", "Domates", "Biber", "Sosis", "Mısır", "Roka", "Sucuk", "Ananas", "Küp Tavuk", "Jalepeno", "Kabak", "Pastırma", "Jambon", "Pizza Sosu"];
  
  const changeHandlerExtras = (e) => {
      const { value, checked } = e.target;
      if (checked) {
          setCheckedExtras([...checkedExtras, value]);
      } else {
          setCheckedExtras(checkedExtras.filter((item) => item !== value));
      }
  };
  const [form, setForm] = useState({
    size: "",
    thickness: "",
    orderers_address: "",
    special_note: "",
    extra_materials: [],
    number_of_pizzas: numberOfPizzas
  });
  const [formErrors, setFormErrors] = useState({});
  const [formDolumu, setformDolumu] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const history = useHistory();

  const formSchema = Yup.object().shape({
    size: Yup.string().required("En az bir adet seçim yapmalısınız."),
    thickness: Yup.string().required("Pizza hamuru kalınlığını seçiniz."),
    orderers_address: Yup.string()
      .required("Lütfen bu alanı doldurunuz..")
      .min(3, "İsim en az 2 karakter olmalıdır"),
    special_note: Yup.string()
      .required("Lütfen bu alanı doldurunuz..")
      .min(3, "Not bölümü en az iki karakter olabilir."),
  });

  const handleValidation = (name, value) => {
    Yup.reach(formSchema, name)
      .validate(value)
      .then(() => setFormErrors({ ...formErrors, [name]: "" }))
      .catch((err) => setFormErrors({ ...formErrors, [name]: err.errors[0] }));
  };

  const changeHandler = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        extra_materials: e.target.checked
          ? [...prev.extra_materials, value]
          : prev.extra_materials.filter((item) => item !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      handleValidation(name, value);
    }
  };

  const changeHandlerCounter = (e) => {
    const newCount = e.target.id === "decrease"
      ? Math.max(numberOfPizzas - 1, 0)
      : numberOfPizzas + 1;
  
    setNumberOfPizzas(newCount);
    setForm(prev => ({
      ...prev,
      number_of_pizzas: newCount
    }));
  };

  useEffect(() => {
    formSchema.isValid(form).then(setformDolumu);
    
    const extrasCost = checkedExtras.length * 5 * numberOfPizzas;
    
    const pizzaBasePrice = form.size === "small" ? 85.5 : form.size === "medium" ? 130 : form.size === "large" ? 180 : 0;
    
    const totalCost = extrasCost + pizzaBasePrice * numberOfPizzas;
    
    setTotalPrice(totalCost);
  }, [form, checkedExtras, numberOfPizzas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formDolumu) {
      axios
        .post("https://reqres.in/api/orders", form)
        .then(() => history.push("/success"))
        .catch(() => console.error("Form submission error"));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-1/3 mb-6">
        <ul className="flex justify-start text-white">
          <li>
            <Link to="/">Anasayfa</Link>
          </li>
          <span>-</span>
          <li>
            <Link to="/">Seçenekler</Link>
          </li>
          <span>-</span>
          <li>
            <Link to="/pizza">Siparişi Oluştur</Link>
          </li>
        </ul>
      </div>
      <div className="bg-white min-h-screen min-w-full flex flex-col items-center">
        <div className="w-1/3">
          <h1 className="my-10 text-xl font-bold">
            Position Absolute Acı Pizza
          </h1>
          <div className="flex my-5 items-end">
            <p className="w-4/6 text-4xl font-bold">85.50₺</p>
            <p className="w-1/6 ">4.9</p>
            <p className="w-1/6">(200)</p>
          </div>
          <p className="text-sm">
            Frontend Dev olarak hala position:absolute kullanıyorsan bu çok acı
            pizza tam sana göre. Pizza, domates, peynir ve genellikle çeşitli
            diğer malzemelerle kaplanmış, daha sonra geleneksel olarak odun
            ateşinde bir fırında yüksek sıcaklıkta pişirilen, genellikle
            yuvarlak, düzleştirilmiş mayalı buğday bazlı hamurdan oluşan İtalyan
            kökenli lezzetli bir yemektir..Küçük bir pizzaya bazen pizzetta
            denir.
          </p>
          <form id="pizza-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-6">
              <div className="w-1/2 space-y-4">
                <h5 className="text-lg">
                  Boyut Seçin <span className="text-red-600">*</span>
                </h5>
                <div>
                  <input
                    type="radio"
                    id="small"
                    name="size"
                    value="small"
                    onChange={changeHandler}
                    className="mr-2"
                  />
                  <label htmlFor="small">Küçük</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="medium"
                    name="size"
                    value="medium"
                    onChange={changeHandler}
                    className="mr-2"
                  />
                  <label htmlFor="medium">Orta</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="large"
                    name="size"
                    value="large"
                    onChange={changeHandler}
                    className="mr-2"
                  />
                  <label htmlFor="large">Büyük</label>
                </div>
                {formErrors.size && (
                  <h6 className="text-red-600"> {formErrors.name} </h6>
                )}
              </div>

              <div className="w-1/2 space-y-4">
                <h5 className="text-lg">
                  Hamur Seçin <span className="text-red-600">*</span>
                </h5>
                <select
                  id="size-dropdown"
                  name="thickness"
                  defaultValue="none"
                  onChange={changeHandler}
                  className="border rounded p-2 w-full"
                >
                  <option value="none" disabled>
                    Hamur Kalınlığı:
                  </option>
                  <option value="small">İnce</option>
                  <option value="normal">Normal</option>
                </select>
                {formErrors.thickness && (
                  <h6 className="text-red-600"> {formErrors.name} </h6>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-lg">Ek Malzemeler</h5>
                <p>
                  En fazla 10 ürün seçebilirsiniz. Her ürün için 5₺
                  eklenecektir.
                </p>
              </div>
              <div className="flex flex-wrap space-y-2">
                {extras.map((item, index) => {
                  return (
                    <div key={index} className="flex items-center mr-3 space-x-2">
                      <input
                        type="checkbox"
                        id={index}
                        name="extra_materials"
                        disabled={
                          checkedExtras.length === 10 &&
                          !checkedExtras.includes(item)
                        }
                        value={item}
                        onChange={changeHandlerExtras}
                      />
                      <label htmlFor={index}>{item}</label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <label htmlFor="name-input" className="text-lg">
                İsim Bilgisi:
              </label>
              <textarea
                id="name-input"
                placeholder="İsim"
                name="orderers_address"
                onChange={changeHandler}
                className="border rounded p-2"
              ></textarea>
              {formErrors.orderers_address && (
                <h6 className="text-red-600">
                  {" "}
                  {formErrors.orderers_address}{" "}
                </h6>
              )}

              <label htmlFor="special-text" className="text-lg">
                Sipariş Notu
              </label>
              <textarea
                id="special-text"
                placeholder="Not"
                name="special_note"
                onChange={changeHandler}
                className="border rounded p-2"
              ></textarea>
              {formErrors.special_note && (
                <h6 className="text-red-600"> {formErrors.special_note} </h6>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  type="button"
                  id="decrease"
                  onClick={changeHandlerCounter}
                  disabled={totalPrice === 0}
                  className="bg-yellow-400 w-10 h-10 rounded-full"
                >
                  -
                </button>
                <h4 data-test-id="numberofpizza" className="text-lg">
                  {numberOfPizzas}
                </h4>
                <button
                  type="button"
                  id="increase"
                  onClick={changeHandlerCounter}
                  disabled={totalPrice === 0}
                  className="bg-yellow-400 w-10 h-10 rounded-full"
                >
                  +
                </button>
              </div>

              <div className="w-1/2 space-y-4">
                <div className="border p-4">
                  <h5 className="text-lg mb-2">Sipariş Toplamı</h5>
                  <div className="flex justify-between">
                    <h6>Ekstra Seçimler</h6>
                    <h6>{checkedExtras.length * 5 * numberOfPizzas}₺</h6>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <h6 id="important">Toplam</h6>
                    <h6 id="important">{totalPrice}₺</h6>
                  </div>
                </div>
                <button
                  id="button-order"
                  type="submit"
                  disabled={!formDolumu}
                  className="bg-yellow-400 w-full h-10 rounded text-lg font-bold"
                >
                  SİPARİŞİ VER
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderPizza;
